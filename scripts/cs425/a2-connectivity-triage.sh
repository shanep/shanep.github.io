#!/usr/bin/env bash
#
# a2-connectivity-triage.sh - everything needed to run CS425 activity A2.
#
# `handout` renders the paper worksheet students fill in; every other command
# stands up the two EC2 hosts the activity probes, where each station is broken
# in a different, diagnosable way.
#
#   ALPHA   tcp 8080  serves a page                       (the healthy baseline)
#           tcp 8081  serves a page, security group drops (silent drop, no reply)
#           tcp 8082  nothing listening, port allowed     (kernel answers RST)
#           tcp 8084  accepts and never writes            (application stall)
#           udp/tcp 53 and 5353, authoritative for cs425.lab:
#                     alpha/bravo resolve, ghost is NXDOMAIN,
#                     mirage resolves to 10.42.13.37, which goes nowhere
#           icmp      allowed
#
#   BRAVO   tcp 8080  serves the same page
#           icmp      not allowed, so the host will not answer ping
#
# The point of the pair is that ALPHA and BRAVO differ only in their security
# groups, so "it does not ping" and "it is down" come apart in front of the class.
#
# Requires: the aws CLI v2 with credentials that can manage EC2, bash, ssh, curl.
# dig and nc are used by 'verify' when they are present and skipped when not.
# 'handout' needs Chrome, Chromium or Edge and nothing else.
#
set -euo pipefail

PROG=$(basename "$0")
ROOT=$(cd "$(dirname "$0")/../.." && pwd)

# The source lives here beside the script; only the rendered PDF goes under
# docs/public, which VitePress copies verbatim onto the website.
HERE=$(cd "$(dirname "$0")" && pwd)

# The worksheet source lives here; only the rendered PDF goes under docs/public,
# which VitePress copies verbatim onto the website. The answer key never goes
# there, and both its source and its PDF stay beside this script.
# Overridable so that a3-name-the-layer.sh can point `handout` and `key` at its
# own documents and forward everything else here, leaving one implementation of
# both the renderer and the testbed.
HANDOUT_HTML="${HANDOUT_HTML:-$HERE/a2-connectivity-triage.html}"
HANDOUT_PDF="${HANDOUT_PDF:-$ROOT/docs/public/cs425/a2-worksheet.pdf}"
HANDOUT_PAGES="${HANDOUT_PAGES:-5}"

KEY_HTML="${KEY_HTML:-$HERE/a2-connectivity-triage-key.html}"
KEY_PDF="${KEY_PDF:-$HERE/a2-connectivity-triage-key.pdf}"
KEY_PAGES="${KEY_PAGES:-4}"

NAME=${TRIAGE_TESTBED_NAME:-cs425-triage}
REGION=${TRIAGE_TESTBED_REGION:-}
PROFILE=${AWS_PROFILE:-}
INSTANCE_TYPE=t3.micro
ARCH=""
CLIENT_CIDR=0.0.0.0/0
SSH_CIDR=""
KEY_NAME=""
KEY_FILE=""
PURGE_KEY=false
REMOTE_HOST=alpha
REMOTE_CMD=()

ZONE=cs425.lab
MIRAGE_ADDR=10.42.13.37
DNS_PORTS="53 5353"

# Ports opened on ALPHA. 8081 is deliberately absent: the station listens on the
# instance and the security group is what drops the packet.
ALPHA_TCP="8080 8082 8084"
BRAVO_TCP="8080"

usage() {
    cat <<EOF
Usage: $PROG <command> [options]

Commands:
  handout     Render the paper worksheet to a PDF (no AWS involved)
  key         Render the instructor answer key and demo script to a PDF
  create      Launch both hosts and wire up the lab DNS zone
  card        Print the target card to put on the board for the class
  status      Print instance ids, states and addresses
  verify      Probe all seven stations and print PASS or FAIL for each
  dns         Rewrite and reload the $ZONE zone from the current addresses
  logs        Print the cloud-init and station logs from a host
  ssh         Open a shell on a host
  destroy     Terminate both hosts and delete the security groups

Options:
  -n, --name NAME       name tag for every resource (default: $NAME)
  -r, --region REGION   AWS region (default: the CLI's configured region)
      --profile NAME    AWS CLI profile to use
  -t, --type TYPE       instance type (default: $INSTANCE_TYPE)
      --arch ARCH       x86_64 or arm64 (default: inferred from the type)
  -c, --cidr CIDR       CIDR the class probes from (default: $CLIENT_CIDR)
  -s, --ssh-cidr CIDR   CIDR allowed to reach port 22 (default: this machine's /32)
  -k, --key NAME        existing EC2 key pair to use (default: create "\$NAME-key")
  -i, --identity FILE   private key file for ssh (default: ~/.ssh/\$NAME-key.pem)
  -H, --host WHICH      'logs' and 'ssh' only: alpha or bravo (default: alpha)
      --purge-key       'destroy' only: also delete the generated key pair
      --                'ssh' only: everything after this runs on the instance
  -h, --help            show this message

Environment:
  CHROME                'handout' only: a Chrome, Chromium or Edge binary to use

Examples:
  $PROG handout
  $PROG create --region us-west-2 --cidr 132.178.0.0/16
  $PROG verify
  $PROG card
  $PROG logs --host bravo
  $PROG destroy --purge-key
EOF
}

# Progress goes to stderr because ensure_sg and launch return an id on stdout.
die()  { printf '%s: %s\n' "$PROG" "$*" >&2; exit 1; }
info() { printf '==> %s\n' "$*" >&2; }
warn() { printf '%s: warning: %s\n' "$PROG" "$*" >&2; }

# ---------------------------------------------------------------- arguments

COMMAND=${1:-}
[ -n "$COMMAND" ] || { usage; exit 1; }
case "$COMMAND" in
    -h|--help|help) usage; exit 0 ;;
esac
shift

while [ $# -gt 0 ]; do
    case "$1" in
        -n|--name)     NAME=$2; shift 2 ;;
        -r|--region)   REGION=$2; shift 2 ;;
        --profile)     PROFILE=$2; shift 2 ;;
        -t|--type)     INSTANCE_TYPE=$2; shift 2 ;;
        --arch)        ARCH=$2; shift 2 ;;
        -c|--cidr)     CLIENT_CIDR=$2; shift 2 ;;
        -s|--ssh-cidr) SSH_CIDR=$2; shift 2 ;;
        -k|--key)      KEY_NAME=$2; shift 2 ;;
        -i|--identity) KEY_FILE=$2; shift 2 ;;
        -H|--host)     REMOTE_HOST=$2; shift 2 ;;
        --purge-key)   PURGE_KEY=true; shift ;;
        -h|--help)     usage; exit 0 ;;
        --)            shift; REMOTE_CMD=("$@"); break ;;
        *)             die "unknown option: $1 (try --help)" ;;
    esac
done

if [ "$COMMAND" != handout ] && [ "$COMMAND" != key ]; then
    command -v aws >/dev/null 2>&1 || die "the aws CLI is not installed"
fi

case "$REMOTE_HOST" in alpha|bravo) ;; *) die "--host must be alpha or bravo" ;; esac

[ -n "$KEY_NAME" ] || KEY_NAME="$NAME-key"
[ -n "$KEY_FILE" ] || KEY_FILE="$HOME/.ssh/$KEY_NAME.pem"

if [ -z "$ARCH" ]; then
    case "${INSTANCE_TYPE%%.*}" in
        *g|*gd|*gn|*gen) ARCH=arm64 ;;
        *)               ARCH=x86_64 ;;
    esac
fi

# Every aws call goes through here so --region and --profile apply everywhere.
awsx() {
    local args=()
    [ -n "$REGION" ] && args+=(--region "$REGION")
    [ -n "$PROFILE" ] && args+=(--profile "$PROFILE")
    aws ${args[@]+"${args[@]}"} "$@"
}

# ------------------------------------------------------------------ helpers

# The AWS CLI prints the string "None" for a null query result.
none() { [ -z "$1" ] || [ "$1" = "None" ]; }

tag_of()  { printf '%s-%s\n' "$NAME" "$1"; }      # alpha -> cs425-triage-alpha
sg_of()   { printf '%s-%s-sg\n' "$NAME" "$1"; }

find_instance() {
    awsx ec2 describe-instances \
        --filters "Name=tag:Name,Values=$(tag_of "$1")" \
                  "Name=instance-state-name,Values=pending,running,stopping,stopped" \
        --query 'sort_by(Reservations[].Instances[], &LaunchTime)[-1].InstanceId' \
        --output text 2>/dev/null || true
}

instance_field() {
    awsx ec2 describe-instances --instance-ids "$1" \
        --query "Reservations[0].Instances[0].$2" --output text
}

# Echoes the public address, or dies. Callers capture it, and a die inside a
# command substitution only kills that subshell, so every caller adds an
# explicit `|| exit 1` rather than trusting errexit to notice.
instance_ip() {
    local id ip
    id=$(find_instance "$1")
    none "$id" && die "no instance tagged Name=$(tag_of "$1"); run '$PROG create' first"
    ip=$(instance_field "$id" PublicIpAddress)
    none "$ip" && die "the $1 instance has no public address yet"
    printf '%s\n' "$ip"
}

my_cidr() {
    local ip
    ip=$(curl -fsS --max-time 10 https://checkip.amazonaws.com 2>/dev/null | tr -d '[:space:]') || ip=""
    if [ -n "$ip" ]; then
        printf '%s/32\n' "$ip"
    else
        warn "could not determine this machine's public IP; opening ssh to 0.0.0.0/0"
        printf '0.0.0.0/0\n'
    fi
}

run_ssh() {
    local ip=$1
    shift
    [ -f "$KEY_FILE" ] || die "private key $KEY_FILE not found (pass --identity)"
    ssh -o StrictHostKeyChecking=accept-new \
        -o UserKnownHostsFile=/dev/null \
        -o ConnectTimeout=10 \
        -o LogLevel=ERROR \
        -i "$KEY_FILE" "ec2-user@$ip" "$@"
}

# ---------------------------------------------------------------- user data

# Both hosts run the same first boot script. It installs the station server and
# the DNS units; which of them actually matter is decided by the security group
# in front of the host, which is the whole lesson of the activity.
user_data() {
    cat <<'CLOUD_INIT'
#!/bin/bash
set -euxo pipefail

dnf -y install python3 dnsmasq

cat > /usr/local/bin/cs425-station <<'STATION'
#!/usr/bin/env python3
"""One CS425 triage station.

  cs425-station PORT ok      serve a small page over HTTP
  cs425-station PORT stall   accept the connection, then never write a byte

The stall mode exists so that a class can see a completed TCP handshake sitting
in front of an application that never answers, which looks nothing like a
refusal and nothing like a drop.
"""
import socket
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1])
MODE = sys.argv[2] if len(sys.argv) > 2 else "ok"
HELD_MAX = 256


class Station(BaseHTTPRequestHandler):
    server_version = "cs425-station/1.0"
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        body = (
            "CS425 triage station\n"
            "port {}\n"
            "You reached this page, so name resolution, routing, the TCP\n"
            "handshake and the application all worked. Write down what that\n"
            "healthy signature looks like before you go break something.\n"
        ).format(PORT).encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    do_HEAD = do_GET

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.client_address[0], fmt % args))


def serve_ok():
    ThreadingHTTPServer(("0.0.0.0", PORT), Station).serve_forever()


def serve_stall():
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(("0.0.0.0", PORT))
    srv.listen(64)
    held = []
    while True:
        conn, peer = srv.accept()
        sys.stderr.write("%s stalled\n" % (peer[0],))
        sys.stderr.flush()
        # Hold the socket open so the handshake stays completed. Bounded, so
        # an afternoon of scanners cannot exhaust the file descriptor table.
        held.append(conn)
        while len(held) > HELD_MAX:
            held.pop(0).close()


if MODE == "stall":
    serve_stall()
else:
    serve_ok()
STATION
chmod 0755 /usr/local/bin/cs425-station

make_station() {
    cat > "/etc/systemd/system/cs425-station-$1.service" <<UNIT
[Unit]
Description=CS425 triage station on port $1 (mode $2)
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/cs425-station $1 $2
Restart=always
RestartSec=2
User=nobody
Group=nobody

[Install]
WantedBy=multi-user.target
UNIT
    systemctl enable --now "cs425-station-$1"
}

# 8080 is the baseline, 8081 is the one the security group drops, 8084 stalls.
# Nothing is ever started on 8082: that station is a port the kernel has no
# listener for, which is what produces the RST.
make_station 8080 ok
make_station 8081 ok
make_station 8084 stall

# A bootstrap zone so dnsmasq comes up before the launcher knows both public
# addresses. The `dns` command overwrites this with the real one.
for port in 53 5353; do
    cat > "/etc/dnsmasq-$port.conf" <<CONF
port=$port
listen-address=0.0.0.0
bind-interfaces
no-resolv
no-hosts
log-queries
pid-file=/run/dnsmasq-$port.pid
local=/cs425.lab/
address=/mirage.cs425.lab/10.42.13.37
CONF
    cat > "/etc/systemd/system/cs425-dns-$port.service" <<UNIT
[Unit]
Description=CS425 lab DNS on port $port
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/sbin/dnsmasq -k -C /etc/dnsmasq-$port.conf
Restart=always
RestartSec=2

[Install]
WantedBy=multi-user.target
UNIT
    systemctl enable --now "cs425-dns-$port"
done

# The packaged unit would fight ours for port 53.
systemctl disable --now dnsmasq.service || true
CLOUD_INIT
}

# The real zone, written once both public addresses are known. `local=` makes
# dnsmasq authoritative for the zone and never a forwarder, which is what turns
# an unknown name into a clean NXDOMAIN instead of a SERVFAIL.
zone_conf() {
    local port=$1 alpha=$2 bravo=$3
    cat <<EOF
port=$port
listen-address=0.0.0.0
bind-interfaces
no-resolv
no-hosts
log-queries
pid-file=/run/dnsmasq-$port.pid
local=/$ZONE/
host-record=alpha.$ZONE,$alpha
host-record=bravo.$ZONE,$bravo
address=/mirage.$ZONE/$MIRAGE_ADDR
EOF
}

# ------------------------------------------------------------------ security

ensure_sg() {
    local which=$1 vpc=$2 name sg
    name=$(sg_of "$which")
    sg=$(awsx ec2 describe-security-groups \
        --filters "Name=group-name,Values=$name" "Name=vpc-id,Values=$vpc" \
        --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)
    if none "$sg"; then
        sg=$(awsx ec2 create-security-group --group-name "$name" --vpc-id "$vpc" \
            --description "CS425 A2 triage testbed ($which)" \
            --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$name},{Key=Project,Value=$NAME}]" \
            --query GroupId --output text)
        info "created security group $name ($sg)"
    else
        info "reusing security group $name ($sg)"
    fi
    printf '%s\n' "$sg"
}

# Duplicate rules are the normal case on a re-run, and AWS rejects them rather
# than ignoring them, so every authorize is allowed to fail.
allow_tcp() {
    awsx ec2 authorize-security-group-ingress --group-id "$1" \
        --ip-permissions "IpProtocol=tcp,FromPort=$2,ToPort=$2,IpRanges=[{CidrIp=$3,Description=$4}]" \
        >/dev/null 2>&1 || true
}

allow_udp() {
    awsx ec2 authorize-security-group-ingress --group-id "$1" \
        --ip-permissions "IpProtocol=udp,FromPort=$2,ToPort=$2,IpRanges=[{CidrIp=$3,Description=$4}]" \
        >/dev/null 2>&1 || true
}

allow_icmp() {
    awsx ec2 authorize-security-group-ingress --group-id "$1" \
        --ip-permissions "IpProtocol=icmp,FromPort=-1,ToPort=-1,IpRanges=[{CidrIp=$2,Description=icmp}]" \
        >/dev/null 2>&1 || true
}

# ------------------------------------------------------------------- launch

launch() {
    local which=$1 sg=$2 subnet=$3 ami=$4 id udfile
    id=$(find_instance "$which")
    if ! none "$id"; then
        info "$which is already running as $id; reusing it"
        printf '%s\n' "$id"
        return 0
    fi

    udfile=$(mktemp "${TMPDIR:-/tmp}/cs425-triage-ud.XXXXXX")
    user_data > "$udfile"

    id=$(awsx ec2 run-instances \
        --image-id "$ami" \
        --instance-type "$INSTANCE_TYPE" \
        --key-name "$KEY_NAME" \
        --metadata-options "HttpTokens=required,HttpEndpoint=enabled" \
        --network-interfaces "AssociatePublicIpAddress=true,DeviceIndex=0,SubnetId=$subnet,Groups=$sg" \
        --user-data "file://$udfile" \
        --tag-specifications \
            "ResourceType=instance,Tags=[{Key=Name,Value=$(tag_of "$which")},{Key=Project,Value=$NAME}]" \
            "ResourceType=volume,Tags=[{Key=Name,Value=$(tag_of "$which")},{Key=Project,Value=$NAME}]" \
        --query 'Instances[0].InstanceId' --output text)
    rm -f "$udfile"
    info "launched $which as $id"
    printf '%s\n' "$id"
}

cmd_create() {
    local vpc subnet ami alpha_sg bravo_sg alpha_id bravo_id

    vpc=$(awsx ec2 describe-vpcs --filters Name=isDefault,Values=true \
        --query 'Vpcs[0].VpcId' --output text)
    none "$vpc" && die "no default VPC in this region; create one first"

    subnet=$(awsx ec2 describe-subnets --filters "Name=vpc-id,Values=$vpc" \
        --query 'sort_by(Subnets, &AvailabilityZone)[0].SubnetId' --output text)
    none "$subnet" && die "the default VPC $vpc has no subnets"

    [ -n "$SSH_CIDR" ] || SSH_CIDR=$(my_cidr)

    alpha_sg=$(ensure_sg alpha "$vpc")
    bravo_sg=$(ensure_sg bravo "$vpc")

    local port
    for port in $ALPHA_TCP; do allow_tcp "$alpha_sg" "$port" "$CLIENT_CIDR" "station$port"; done
    for port in $DNS_PORTS; do
        allow_udp "$alpha_sg" "$port" "$CLIENT_CIDR" "dns$port"
        allow_tcp "$alpha_sg" "$port" "$CLIENT_CIDR" "dns$port"
    done
    allow_icmp "$alpha_sg" "$CLIENT_CIDR"
    allow_tcp "$alpha_sg" 22 "$SSH_CIDR" ssh

    # BRAVO gets 8080 and nothing else. No ICMP rule here is the entire point of
    # station 6, so do not "fix" it.
    for port in $BRAVO_TCP; do allow_tcp "$bravo_sg" "$port" "$CLIENT_CIDR" "station$port"; done
    allow_tcp "$bravo_sg" 22 "$SSH_CIDR" ssh

    info "alpha: tcp $ALPHA_TCP, dns $DNS_PORTS and icmp open to $CLIENT_CIDR (8081 deliberately closed)"
    info "bravo: tcp $BRAVO_TCP open to $CLIENT_CIDR, no icmp rule at all"
    info "ssh on both open to $SSH_CIDR"

    if ! awsx ec2 describe-key-pairs --key-names "$KEY_NAME" >/dev/null 2>&1; then
        info "creating key pair $KEY_NAME"
        mkdir -p "$(dirname "$KEY_FILE")"
        awsx ec2 create-key-pair --key-name "$KEY_NAME" \
            --query KeyMaterial --output text > "$KEY_FILE"
        chmod 400 "$KEY_FILE"
        info "private key written to $KEY_FILE"
    fi

    ami=$(awsx ssm get-parameter \
        --name "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-$ARCH" \
        --query 'Parameter.Value' --output text)
    info "launching two $INSTANCE_TYPE ($ARCH) from $ami"

    alpha_id=$(launch alpha "$alpha_sg" "$subnet" "$ami")
    bravo_id=$(launch bravo "$bravo_sg" "$subnet" "$ami")

    info "waiting for both instances to run"
    awsx ec2 wait instance-running --instance-ids "$alpha_id" "$bravo_id"

    info "waiting for the baseline station on alpha (a minute or two on a first boot)"
    local alpha_ip bravo_ip i=0
    alpha_ip=$(instance_ip alpha) || exit 1
    bravo_ip=$(instance_ip bravo) || exit 1
    while [ $i -lt 30 ]; do
        curl -fsS -o /dev/null --max-time 5 "http://$alpha_ip:8080/" && break
        i=$((i + 1))
        sleep 6
    done
    [ $i -lt 30 ] || warn "alpha:8080 never answered; check '$PROG logs'"

    cmd_dns
    cmd_card
}

# --------------------------------------------------------------------- dns

cmd_dns() {
    local alpha_ip bravo_ip port
    alpha_ip=$(instance_ip alpha) || exit 1
    bravo_ip=$(instance_ip bravo) || exit 1
    info "writing the $ZONE zone: alpha=$alpha_ip bravo=$bravo_ip mirage=$MIRAGE_ADDR"
    for port in $DNS_PORTS; do
        zone_conf "$port" "$alpha_ip" "$bravo_ip" |
            run_ssh "$alpha_ip" "sudo tee /etc/dnsmasq-$port.conf >/dev/null"
        run_ssh "$alpha_ip" "sudo systemctl restart cs425-dns-$port"
    done
    info "lab DNS reloaded on ports $DNS_PORTS"
}

# ------------------------------------------------------------------- report

cmd_status() {
    local which id
    for which in alpha bravo; do
        id=$(find_instance "$which")
        if none "$id"; then
            printf '  %-6s not launched\n' "$which"
        else
            printf '  %-6s %s (%s) %s\n' "$which" "$id" \
                "$(instance_field "$id" 'State.Name')" \
                "$(instance_field "$id" PublicIpAddress)"
        fi
    done
}

cmd_card() {
    local alpha_ip bravo_ip
    alpha_ip=$(instance_ip alpha) || exit 1
    bravo_ip=$(instance_ip bravo) || exit 1
    cat <<EOF

  ------------------------------------------------------------------
   CS425 A2 target card                        put this on the board
  ------------------------------------------------------------------

     ALPHA = $alpha_ip
     BRAVO = $bravo_ip

     Station 1   ALPHA 8080          baseline
     Station 2   ALPHA 8081
     Station 3   ALPHA 8082
     Station 4   ghost.$ZONE     dig +short ghost.$ZONE @ALPHA -p 5353
     Station 5   mirage.$ZONE    dig +short mirage.$ZONE @ALPHA -p 5353
     Station 6   BRAVO 8080
     Station 7   ALPHA 8084          stretch

     The lab DNS answers on 53 and 5353. Use -p 5353: many networks
     intercept outbound port 53 and will answer for the server.

  ------------------------------------------------------------------

EOF
}

# ------------------------------------------------------------------- verify

PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0

pass() { printf '  PASS  %s\n' "$*"; PASS_COUNT=$((PASS_COUNT + 1)); }
fail() { printf '  FAIL  %s\n' "$*"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
skip() { printf '  SKIP  %s\n' "$*"; SKIP_COUNT=$((SKIP_COUNT + 1)); }

# GNU timeout(1) is not on macOS, and ping's own timeout flag means seconds on
# Linux and milliseconds on macOS, so the watchdog is done by hand instead.
run_timeout() {
    local secs=$1
    shift
    "$@" &
    local pid=$!
    ( sleep "$secs"; kill -9 "$pid" ) >/dev/null 2>&1 &
    local dog=$!
    local rc=0
    wait "$pid" 2>/dev/null || rc=$?
    kill -9 "$dog" >/dev/null 2>&1 || true
    return $rc
}

# Echoes how many replies ping got back, or nothing if it never printed its
# summary line. BSD says "0 packets received" and GNU says "0 received", so the
# count is read as the token in front of the word rather than by field number.
ping_received() {
    local rc=0 out
    out=$(run_timeout 20 ping -c 2 "$1" 2>/dev/null) || rc=$?
    printf '%s\n' "$out" |
        tr -d ',' |
        sed 's/packets received/received/' |
        awk '{for (i = 1; i <= NF; i++) if ($i == "received") { print $(i-1); exit }}'
}

# One query against the lab zone. `+short` is passed through rather than baked
# in because station 4 is diagnosed from the status field and station 5 from the
# answer, and both have to go to whichever port is actually reaching the server.
zone_query() {
    local ip=$1 port=$2 mode=$3 name=$4
    if [ "$mode" = "+short" ]; then
        dig +short +time=3 +tries=1 "$name" "@$ip" -p "$port" 2>/dev/null
    else
        dig +time=3 +tries=1 "$name" "@$ip" -p "$port" 2>/dev/null
    fi
}

# BSD nc spells the connect timeout -G and treats -w as an idle timeout, so on a
# Mac `nc -w 5` against a dropped port waits out the full OS timeout, about 75
# seconds, rather than 5. GNU and OpenBSD nc use -w for both.
nc_timeout_flag() {
    case "$(uname -s)" in
        Darwin|*BSD) printf -- '-G\n' ;;
        *)           printf -- '-w\n' ;;
    esac
}

# Echoes curl's exit status. 0 is a completed request, 7 is a refusal, 28 is a
# timeout, and those three are the signatures the whole activity turns on.
curl_status() {
    local rc=0
    curl -sS -o /dev/null --connect-timeout "${3:-6}" --max-time "${3:-6}" \
        "http://$1:$2/" >/dev/null 2>&1 || rc=$?
    printf '%s\n' "$rc"
}

cmd_verify() {
    local alpha_ip bravo_ip rc out
    alpha_ip=$(instance_ip alpha) || exit 1
    bravo_ip=$(instance_ip bravo) || exit 1
    printf '\n  alpha=%s bravo=%s\n\n' "$alpha_ip" "$bravo_ip"

    rc=$(curl_status "$alpha_ip" 8080)
    [ "$rc" = 0 ] && pass "station 1  alpha:8080 serves the baseline page" \
                  || fail "station 1  alpha:8080 did not answer (curl exit $rc)"

    rc=$(curl_status "$alpha_ip" 8081)
    [ "$rc" = 28 ] && pass "station 2  alpha:8081 times out, the SYN is dropped" \
                   || fail "station 2  alpha:8081 should time out (curl exit $rc, wanted 28)"

    rc=$(curl_status "$alpha_ip" 8082)
    [ "$rc" = 7 ] && pass "station 3  alpha:8082 refuses immediately" \
                  || fail "station 3  alpha:8082 should refuse (curl exit $rc, wanted 7)"

    if command -v dig >/dev/null 2>&1; then
        local dns_port=""
        for port in $DNS_PORTS; do
            if [ "$(zone_query "$alpha_ip" "$port" +short "alpha.$ZONE")" = "$alpha_ip" ]; then
                dns_port=$port
                break
            fi
        done

        if [ -z "$dns_port" ]; then
            fail "stations 4 and 5  the lab zone answers on neither port $DNS_PORTS"
        else
            if [ "$dns_port" != 53 ]; then
                pass "stations 4 and 5  lab zone is live on port $dns_port"
                warn "port 53 did not reach the server from this machine, so this"
                warn "network intercepts outbound DNS. Students here must use -p $dns_port,"
                warn "and a plain dig will lie to them rather than fail."
            else
                pass "stations 4 and 5  lab zone is live on port 53"
            fi

            out=$(zone_query "$alpha_ip" "$dns_port" +noshort "ghost.$ZONE" |
                  awk -F'status: ' '/status:/ {split($2, a, ","); print a[1]}')
            [ "$out" = NXDOMAIN ] && pass "station 4  ghost.$ZONE is NXDOMAIN" \
                                  || fail "station 4  ghost.$ZONE returned '${out:-no answer}', wanted NXDOMAIN"

            out=$(zone_query "$alpha_ip" "$dns_port" +short "mirage.$ZONE" | head -1)
            [ "$out" = "$MIRAGE_ADDR" ] && pass "station 5  mirage.$ZONE resolves to $MIRAGE_ADDR" \
                                        || fail "station 5  mirage.$ZONE returned '${out:-no answer}', wanted $MIRAGE_ADDR"
        fi
    else
        skip "stations 4 and 5  dig is not installed on this machine"
    fi

    out=$(ping_received "$bravo_ip")
    rc=$(curl_status "$bravo_ip" 8080)
    if [ -z "$out" ]; then
        skip "station 6  ping printed no summary on this machine; check by hand"
    elif [ "$out" = 0 ] && [ "$rc" = 0 ]; then
        pass "station 6  bravo drops icmp but serves 8080"
    else
        fail "station 6  bravo: ping replies=$out (wanted 0), curl exit $rc (wanted 0)"
    fi

    # The contrast only means something if the other host does answer.
    out=$(ping_received "$alpha_ip")
    if [ -z "$out" ]; then
        skip "station 6  could not confirm that alpha answers ping"
    elif [ "$out" -gt 0 ] 2>/dev/null; then
        pass "station 6  alpha answers ping ($out replies), so bravo is the difference"
    else
        fail "station 6  alpha answered 0 pings, so the contrast with bravo is gone"
    fi

    if command -v nc >/dev/null 2>&1; then
        if nc -z "$(nc_timeout_flag)" 5 "$alpha_ip" 8084 >/dev/null 2>&1; then
            rc=$(curl_status "$alpha_ip" 8084)
            [ "$rc" = 28 ] && pass "station 7  alpha:8084 connects then stalls" \
                           || fail "station 7  alpha:8084 connected but curl exit $rc, wanted 28"
        else
            fail "station 7  alpha:8084 did not accept a connection"
        fi
    else
        skip "station 7  nc is not installed on this machine"
    fi

    printf '\n  %d passed, %d failed, %d skipped\n\n' "$PASS_COUNT" "$FAIL_COUNT" "$SKIP_COUNT"
    [ "$FAIL_COUNT" -eq 0 ]
}

# -------------------------------------------------------------------- shell

cmd_logs() {
    local ip
    ip=$(instance_ip "$REMOTE_HOST") || exit 1
    run_ssh "$ip" 'echo "=== cloud-init ==="; sudo tail -40 /var/log/cloud-init-output.log;
                   echo; echo "=== stations ==="; sudo journalctl -u "cs425-station-*" -n 40 --no-pager;
                   echo; echo "=== lab dns ==="; sudo journalctl -u "cs425-dns-*" -n 40 --no-pager'
}

cmd_ssh() {
    local ip
    ip=$(instance_ip "$REMOTE_HOST") || exit 1
    if [ ${#REMOTE_CMD[@]} -gt 0 ]; then
        run_ssh "$ip" "${REMOTE_CMD[@]}"
    else
        run_ssh "$ip"
    fi
}

# ------------------------------------------------------------------ handout

# The worksheet is authored as HTML with a print stylesheet, because it needs
# fill in rules, fixed page breaks and tables that survive a photocopier, and
# none of that comes out of markdown. Headless Chrome is the renderer, so what
# a browser previews is what comes off the printer.
#
# macOS keeps the binary inside the app bundle and Linux puts it on PATH under
# one of several names, so both shapes are searched rather than assuming either.
find_chrome() {
    if [ -n "${CHROME:-}" ]; then
        [ -x "$CHROME" ] || die "CHROME is set to $CHROME, which is not executable"
        printf '%s\n' "$CHROME"
        return 0
    fi

    local candidate
    for candidate in \
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
        "/Applications/Chromium.app/Contents/MacOS/Chromium" \
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
    do
        [ -x "$candidate" ] && { printf '%s\n' "$candidate"; return 0; }
    done

    for candidate in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge; do
        command -v "$candidate" >/dev/null 2>&1 && { command -v "$candidate"; return 0; }
    done

    die "no Chrome, Chromium or Edge found; install one or set CHROME"
}

# stat's flags are one of the sharper BSD versus GNU splits, so ask wc instead.
# The redirect is the shell's, not wc's, so a missing file has to be caught here
# rather than swallowed with 2>/dev/null.
file_size() {
    [ -f "$1" ] || { printf '0\n'; return 0; }
    wc -c < "$1" 2>/dev/null | tr -d '[:space:]'
}

# A worksheet that quietly grew a fifth page is the failure worth catching, and
# counting the page objects is cheap enough to do on every render.
pdf_pages() {
    python3 -c 'import re,sys; print(len(re.findall(rb"/Type\s*/Page[^s]", open(sys.argv[1],"rb").read())))' \
        "$1" 2>/dev/null || printf '?\n'
}

# render_pdf <source html> <target pdf> <expected page count>
render_pdf() {
    local html=$1 pdf=$2 want=$3
    local chrome profile pid size last=x i=0 count
    [ -f "$html" ] || die "no source at $html"
    chrome=$(find_chrome)
    info "rendering $(basename "$html") with $(basename "$chrome")"

    rm -f "$pdf"
    profile=$(mktemp -d "${TMPDIR:-/tmp}/a2-render.XXXXXX")

    # The throwaway profile is what stops this being a silent no-op when the
    # person running it already has Chrome open. The cost of it is that Chrome
    # then writes the PDF and sits there instead of exiting, so rather than
    # waiting on a process that is never going to return, wait for the file to
    # stop growing and kill it.
    "$chrome" \
        --headless \
        --disable-gpu \
        --no-pdf-header-footer \
        --user-data-dir="$profile" \
        --print-to-pdf="$pdf" \
        "file://$html" >/dev/null 2>&1 &
    pid=$!

    while [ $i -lt 60 ]; do
        sleep 1
        i=$((i + 1))
        size=$(file_size "$pdf") || size=""
        if [ -n "$size" ] && [ "$size" != 0 ] && [ "$size" = "$last" ]; then
            break
        fi
        last=$size
        kill -0 "$pid" 2>/dev/null || break
    done

    kill -9 "$pid" >/dev/null 2>&1 || true
    wait "$pid" 2>/dev/null || true
    rm -rf "$profile"

    [ -s "$pdf" ] || die "chrome wrote no output; try CHROME=/path/to/chrome $PROG $COMMAND"

    count=$(pdf_pages "$pdf")
    info "wrote ${pdf#"$ROOT"/} ($count pages, $(file_size "$pdf") bytes)"
    if [ "$count" != "$want" ]; then
        warn "expected $want pages; the layout has overflowed, open the HTML and tighten it"
    fi
}

cmd_handout() { render_pdf "$HANDOUT_HTML" "$HANDOUT_PDF" "$HANDOUT_PAGES"; }

cmd_key() {
    render_pdf "$KEY_HTML" "$KEY_PDF" "$KEY_PAGES"
    warn "that is an answer key: it does not go in docs/public and does not go on the website"
}

# ------------------------------------------------------------------ destroy

cmd_destroy() {
    local which id ids=() sg
    for which in alpha bravo; do
        id=$(find_instance "$which")
        none "$id" || ids+=("$id")
    done

    if [ ${#ids[@]} -gt 0 ]; then
        info "terminating ${ids[*]}"
        awsx ec2 terminate-instances --instance-ids "${ids[@]}" >/dev/null
        info "waiting for the instances to terminate"
        awsx ec2 wait instance-terminated --instance-ids "${ids[@]}"
    else
        info "no instances tagged $NAME-alpha or $NAME-bravo to terminate"
    fi

    # A security group cannot be deleted while an ENI still references it, and
    # AWS releases those a little after the instance reports terminated.
    for which in alpha bravo; do
        sg=$(awsx ec2 describe-security-groups \
            --filters "Name=group-name,Values=$(sg_of "$which")" \
            --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)
        none "$sg" && continue
        local i=0
        while [ $i -lt 12 ]; do
            if awsx ec2 delete-security-group --group-id "$sg" >/dev/null 2>&1; then
                info "deleted security group $(sg_of "$which") ($sg)"
                break
            fi
            i=$((i + 1))
            sleep 5
        done
        [ $i -lt 12 ] || warn "could not delete $(sg_of "$which") ($sg); delete it by hand"
    done

    if [ "$PURGE_KEY" = true ]; then
        awsx ec2 delete-key-pair --key-name "$KEY_NAME" >/dev/null 2>&1 || true
        rm -f "$KEY_FILE"
        info "deleted key pair $KEY_NAME and $KEY_FILE"
    fi
}

# ----------------------------------------------------------------- dispatch

case "$COMMAND" in
    handout) cmd_handout ;;
    key)     cmd_key ;;
    create)  cmd_create ;;
    card)    cmd_card ;;
    status)  cmd_status ;;
    verify)  cmd_verify ;;
    dns)     cmd_dns ;;
    logs)    cmd_logs ;;
    ssh)     cmd_ssh ;;
    destroy) cmd_destroy ;;
    *)       die "unknown command: $COMMAND (try --help)" ;;
esac
