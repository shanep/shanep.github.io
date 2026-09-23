#!/usr/bin/env python3
"""Certificate and PKI demonstration for CS 331, Lab 6.

Builds a small certificate chain in memory -- a root CA, an intermediate CA,
and three server certificates -- then inspects and checks each one the way a
browser would.  The three server certificates are:

    good        signed by the intermediate, in date, correct hostname
    expired     the same certificate, but its validity window has passed
    wrong-name  in date and correctly signed, but issued for another hostname

Everything is generated fresh each run, so nothing here expires on its own and
no network connection is needed.

Requires the `cryptography` package (installed in Lab 0):

    pip install cryptography
    python3 cert_inspect.py

CS 331 -- Computer Security and Information Assurance
"""

from __future__ import annotations

import datetime as dt
from typing import Final, NamedTuple

from cryptography import x509
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.x509.oid import NameOID

# ---------------------------------------------------------------------------
# CHANGE THESE and re-run.
# ---------------------------------------------------------------------------

# The hostname the "browser" is trying to reach.  Change it to
# "shop.example.edu" and watch which certificate becomes acceptable.
HOSTNAME_BEING_VISITED: Final[str] = "www.example.edu"

# ---------------------------------------------------------------------------

KEY_SIZE: Final[int] = 2048
NOW: Final[dt.datetime] = dt.datetime.now(dt.timezone.utc)


class Issued(NamedTuple):
    """A certificate together with the private key that belongs to it."""

    certificate: x509.Certificate
    private_key: rsa.RSAPrivateKey


def name(common_name: str, organisation: str) -> x509.Name:
    return x509.Name(
        [
            x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, organisation),
            x509.NameAttribute(NameOID.COMMON_NAME, common_name),
        ]
    )


def make_ca(common_name: str, organisation: str, issuer: Issued | None) -> Issued:
    """Create a CA certificate, self-signed if `issuer` is None."""
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=KEY_SIZE)
    subject = name(common_name, organisation)
    issuer_name = subject if issuer is None else issuer.certificate.subject
    signing_key = private_key if issuer is None else issuer.private_key

    certificate = (
        x509.CertificateBuilder()
        .subject_name(subject)
        .issuer_name(issuer_name)
        .public_key(private_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(NOW - dt.timedelta(days=1))
        .not_valid_after(NOW + dt.timedelta(days=3650))
        .add_extension(x509.BasicConstraints(ca=True, path_length=None), critical=True)
        .sign(signing_key, hashes.SHA256())
    )
    return Issued(certificate, private_key)


def make_server_certificate(
    issuer: Issued,
    common_name: str,
    hostnames: tuple[str, ...],
    not_before: dt.datetime,
    not_after: dt.datetime,
) -> Issued:
    """Create an end-entity (server) certificate signed by `issuer`."""
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=KEY_SIZE)
    certificate = (
        x509.CertificateBuilder()
        .subject_name(name(common_name, "Example University"))
        .issuer_name(issuer.certificate.subject)
        .public_key(private_key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(not_before)
        .not_valid_after(not_after)
        .add_extension(x509.BasicConstraints(ca=False, path_length=None), critical=True)
        .add_extension(
            x509.SubjectAlternativeName([x509.DNSName(host) for host in hostnames]),
            critical=False,
        )
        .sign(issuer.private_key, hashes.SHA256())
    )
    return Issued(certificate, private_key)


def subject_alt_names(certificate: x509.Certificate) -> list[str]:
    try:
        extension = certificate.extensions.get_extension_for_class(
            x509.SubjectAlternativeName
        )
    except x509.ExtensionNotFound:
        return []
    return extension.value.get_values_for_type(x509.DNSName)


def signature_is_valid(child: x509.Certificate, parent: x509.Certificate) -> bool:
    """Check that `parent` actually signed `child`."""
    parent_public_key = parent.public_key()
    if not isinstance(parent_public_key, rsa.RSAPublicKey):
        return False
    signature_hash = child.signature_hash_algorithm
    if signature_hash is None:
        return False
    try:
        parent_public_key.verify(
            child.signature,
            child.tbs_certificate_bytes,
            padding.PKCS1v15(),
            signature_hash,
        )
    except InvalidSignature:
        return False
    return True


def describe(certificate: x509.Certificate) -> None:
    """Print the fields a browser shows when you click the padlock."""
    print(f"    subject:      {certificate.subject.rfc4514_string()}")
    print(f"    issuer:       {certificate.issuer.rfc4514_string()}")
    print(f"    serial:       {certificate.serial_number:x}")
    print(f"    not before:   {certificate.not_valid_before_utc}")
    print(f"    not after:    {certificate.not_valid_after_utc}")
    print(f"    signature:    {certificate.signature_algorithm_oid._name}")
    names = subject_alt_names(certificate)
    if names:
        print(f"    SAN (DNS):    {', '.join(names)}")


def check(
    label: str,
    leaf: x509.Certificate,
    intermediate: x509.Certificate,
    root: x509.Certificate,
    hostname: str,
) -> None:
    """Run the checks a browser runs, and say which one fails."""
    print(f"\n  --- {label} ---")
    describe(leaf)

    results: list[tuple[str, bool, str]] = []

    in_date = leaf.not_valid_before_utc <= NOW <= leaf.not_valid_after_utc
    results.append(
        ("validity period covers today", in_date, f"checked against {NOW:%Y-%m-%d}")
    )

    names = subject_alt_names(leaf)
    name_matches = hostname in names
    results.append(
        ("hostname appears in SAN", name_matches, f"looking for {hostname!r}")
    )

    leaf_signed = signature_is_valid(leaf, intermediate)
    results.append(
        ("signed by the intermediate CA", leaf_signed, "verified with the CA public key")
    )

    chain_signed = signature_is_valid(intermediate, root)
    results.append(
        ("intermediate signed by the root", chain_signed, "chain continues to the root")
    )

    root_trusted = True  # in this demonstration the root is in our trust store
    results.append(
        ("root is in the trust store", root_trusted, "assumed for this demonstration")
    )

    print("    checks:")
    for description, passed, detail in results:
        mark = "PASS" if passed else "FAIL"
        print(f"      [{mark}] {description} ({detail})")

    accepted = all(passed for _, passed, _ in results)
    print(f"    VERDICT: {'accept the connection' if accepted else 'REFUSE the connection'}")


def main() -> int:
    print("=" * 72)
    print("CERTIFICATES AND PKI -- CS 331 Lab 6")
    print("=" * 72)
    print(f"\nBrowser is trying to reach: {HOSTNAME_BEING_VISITED}")
    print("Generating a fresh certificate chain (a few seconds)...")

    root = make_ca("Example Root CA", "Example Trust Services", issuer=None)
    intermediate = make_ca("Example Issuing CA", "Example Trust Services", issuer=root)

    good = make_server_certificate(
        intermediate,
        "www.example.edu",
        ("www.example.edu", "example.edu"),
        NOW - dt.timedelta(days=30),
        NOW + dt.timedelta(days=335),
    )
    expired = make_server_certificate(
        intermediate,
        "www.example.edu",
        ("www.example.edu", "example.edu"),
        NOW - dt.timedelta(days=800),
        NOW - dt.timedelta(days=435),
    )
    wrong_name = make_server_certificate(
        intermediate,
        "shop.example.edu",
        ("shop.example.edu",),
        NOW - dt.timedelta(days=30),
        NOW + dt.timedelta(days=335),
    )

    print("\n" + "=" * 72)
    print("THE CHAIN")
    print("=" * 72)
    print("\n  Root CA (self-signed, trusted because it is in the trust store):")
    describe(root.certificate)
    print(f"    self-signed: {signature_is_valid(root.certificate, root.certificate)}")
    print("\n  Intermediate CA (signed by the root):")
    describe(intermediate.certificate)

    print("\n" + "=" * 72)
    print("THREE SERVER CERTIFICATES")
    print("=" * 72)
    for label, issued in (
        ("good", good),
        ("expired", expired),
        ("wrong-name", wrong_name),
    ):
        check(
            label,
            issued.certificate,
            intermediate.certificate,
            root.certificate,
            HOSTNAME_BEING_VISITED,
        )

    print("\n" + "=" * 72)
    print("Every check above is arithmetic on the certificate contents except")
    print("the last one. 'Root is in the trust store' is a decision somebody")
    print("made on your behalf -- your operating system or browser vendor")
    print("shipped a list of a few hundred organisations it will believe.")
    print("That decision is the trust assumption underneath all of TLS.")
    print("=" * 72)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
