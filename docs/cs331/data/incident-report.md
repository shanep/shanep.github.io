# Incident report: NORTHWIND MEADOW

*Internal post-incident write-up. You analyse this in
[Lab 7](../assignments/lab-07-malware-triage.md).*

**Organisation:** Cascade Regional Health, a 900-employee hospital network
**Prepared by:** Security operations, day 31
**Classification:** Internal, teaching copy, all names and addresses changed
**Status:** Contained. Eradication complete. This report is the written record.

Everything below is what responders observed and recorded. It is deliberately written the way real
incident write-ups are written: chronological, uneven in detail, with a few things that were never
established. It has not been mapped to any framework: that is your job.

---

## Day 0: Tuesday

At 09:14 a billing coordinator in Accounts Receivable received an email appearing to come from a
medical-supply vendor the department uses. The message referred to an outstanding invoice by a
plausible number and attached a file named `Invoice_44192_Cascade.xlsm`. The sender address was
`ar@casca de-medsupply.com`, a domain registered eleven days earlier and not previously seen in
the organisation's mail logs.

Four other staff in the same department received near-identical messages within six minutes. One
forwarded it to a colleague asking whether it was expected.

At 09:22 the billing coordinator opened the attachment and clicked through the macro warning
banner. The spreadsheet displayed a blurred image of an invoice and a line reading "Enable editing
to view this protected document."

The macro, when later extracted, ran a PowerShell command that downloaded a second file from
`hxxps://cdn-assets-delivery[.]net/wp-content/uploads/2027/j8x.dat` and executed it in memory. It
did not write that payload to disk.

## Day 0: the first hour

The downloaded component established an outbound HTTPS connection to
`hxxps://api-telemetry-sync[.]com` and began polling it every 47 seconds. Traffic was TLS-encrypted
and used a valid certificate for that domain. Total volume in the first hour was under 40 KB.

Within twenty minutes the component:

- Enumerated the local machine: hostname, domain, logged-on user, OS version, installed antivirus,
  and the list of running processes.
- Enumerated the domain: it queried Active Directory for the list of domain administrators, the
  list of file servers, and the membership of several groups.
- Read the browser credential stores for two installed browsers and the Windows Credential Manager.
- Created a scheduled task named `MicrosoftEdgeUpdateTaskMachineUA` set to run every 60 minutes,
  pointing at a copy of itself placed in `C:\Users\<user>\AppData\Local\Temp\`.

The endpoint agent on this machine flagged the PowerShell execution as suspicious and raised a
medium alert at 09:26. The alert entered a queue that averaged 400 medium alerts per day. It was
not reviewed.

## Days 1-6

The operators returned during business hours only, roughly 08:00 to 17:00 local time, and were
inactive over the intervening weekend.

Using a credential recovered from the billing coordinator's browser store, they authenticated to an
internal file share as a second, more privileged service account. That account's password was
identical to one used for a departmental application and had not been changed in three years.

From there they:

- Moved to two additional workstations and one file server using the operating system's own remote
  administration tooling. No malware was installed on those hosts; the operators used built-in
  utilities already present.
- Ran a password-dumping utility against the memory of a process on the file server, recovering
  hashes for eleven accounts, one of which was a domain administrator.
- Disabled the endpoint agent on the file server by stopping its service, having first confirmed
  which product was installed during the Day 0 enumeration.
- Deleted the Windows Security event log on that server after the agent was stopped.

Between Day 4 and Day 6 approximately 74 GB was transferred out, in chunks of roughly 400 MB, to
the same `api-telemetry-sync[.]com` host that had been used for command and control. The transfers
occurred between 01:00 and 04:00. The data was compressed and encrypted before it left; responders
were never able to confirm its exact contents, but the source directories were the shares holding
scanned patient intake forms and the billing department's working files.

## Day 7: Monday, 02:40

Every file on four file servers and 190 workstations was encrypted. Each affected directory
received a file named `HOW_TO_RESTORE_YOUR_FILES.txt` containing a payment demand, a Tor address,
and a sample of eleven filenames from the exfiltrated set as proof of possession.

Before encrypting, the payload:

- Deleted Volume Shadow Copies on every host it reached.
- Stopped 34 named services, including the backup agent and two database services, so their files
  would not be locked.

The nightly backup job had been failing silently since a storage migration on Day −40. The failure
notifications went to a distribution list that had been emptied during a staff change. The last
successful backup was 47 days old.

## Days 7-30

Clinical systems ran on downtime procedures for nine days. Elective procedures were rescheduled.
Restoration from the 47-day-old backup plus paper records took until Day 26.

No payment was made. The exfiltrated data was published on a leak site on Day 19.

## Indicators recorded

| Type | Value |
| --- | --- |
| Sender domain | `casca de-medsupply.com`, registered Day −11 |
| Attachment | `Invoice_44192_Cascade.xlsm`, SHA-256 `4f1a…` (macro-enabled workbook) |
| Stage-two host | `cdn-assets-delivery[.]net` |
| Command and control | `api-telemetry-sync[.]com`, polled every 47 s |
| Persistence | Scheduled task `MicrosoftEdgeUpdateTaskMachineUA` |
| Staging path | `C:\Users\<user>\AppData\Local\Temp\` |
| Ransom note | `HOW_TO_RESTORE_YOUR_FILES.txt` |

## What was never established

- Whether the four other recipients on Day 0 opened their attachments. Mail logs had rotated.
- How the operators chose Cascade Regional Health, or whether they knew what data they had taken
  before they took it.
- Whether the same operators wrote the ransomware payload or obtained it from someone else.
- The exact contents of the 74 GB.
