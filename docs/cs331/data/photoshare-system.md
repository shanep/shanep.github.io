# SnapVault: system description

*The system you threat-model in [Lab 2](../assignments/lab-02-threat-model.md).*

SnapVault is a small photo-sharing service run by a three-person company. Everything below is a
description of how it works today. It is a made-up system, but it is built the way small services
are actually built, including the shortcuts.

Read it once end to end before you start diagramming.

## What it does

A user creates an account, uploads photos from a phone or a browser, and marks each photo as
**private**, **shared with named friends**, or **public**. Public photos appear on a public page at
`snapvault.example/u/<username>`. A user can also generate a **share link**: a long random URL
that shows one album to anybody who has the link, with no login required.

## The pieces

| # | Component | Runs where | Notes |
| ---: | --- | --- | --- |
| 1 | Mobile app (iOS, Android) | The user's phone | Talks to the API over HTTPS. Stores the user's session token in the phone's keychain. |
| 2 | Web front end | The user's browser | JavaScript single-page app served from the CDN. Talks to the same API. |
| 3 | CDN | Third-party provider | Serves the web app's files and, separately, serves photo image files directly to browsers. |
| 4 | API server | Two virtual machines at a cloud provider | Python. Handles login, uploads, album permissions, and share links. |
| 5 | Database | Managed database at the same cloud provider | Postgres. Holds accounts, album metadata, permissions, and share-link tokens. |
| 6 | Photo storage | Object storage bucket at the same cloud provider | The image files themselves. The API writes here; the CDN reads from here. |
| 7 | Thumbnail worker | A third virtual machine | Pulls newly uploaded photos from a queue, generates thumbnails, writes them back to object storage. |
| 8 | Admin console | Browser, staff only | A separate web app on `admin.snapvault.example` used by the three employees for support. |
| 9 | Nightly backup job | Runs on the database VM | Dumps the database to a second object storage bucket at 02:00. |

## Who uses it

| Actor | What they can do |
| --- | --- |
| **Anonymous visitor** | View public photos. Open a share link if they have the URL. |
| **Registered user** | Everything a visitor can do, plus: upload, delete, and re-classify their own photos; manage their friend list; create and revoke share links for their own albums. |
| **Friend of a user** | View photos that user has shared with them. |
| **Support staff** (3 people) | Through the admin console: look up any account, reset any password, view any album including private ones, and delete accounts. All three staff share one admin login. |
| **Thumbnail worker** | Read any newly uploaded photo; write thumbnails. |
| **Cloud provider** | Operates the VMs, the database, and the object storage. |

## How things actually work today

These are the facts you need. Some of them are fine. Some of them are not.

**Accounts and login.** Email address and password. Passwords are stored as PBKDF2 hashes with a
per-user salt. There is no multi-factor authentication for users. The admin console uses the same
login form as the user site; an account flagged `is_staff` in the database is allowed in.

**Sessions.** On login the API issues a bearer token that is valid for 90 days and is not tied to a
device or IP address. There is no way for a user to see or revoke their active sessions. Logging
out deletes the token on the client only.

**Uploads.** The mobile app and the web app both POST the image to the API over HTTPS. The API
writes the file to object storage under a path derived from the user ID and a random file name,
then inserts a row in the database recording the owner and the privacy setting.

**Serving photos.** The CDN serves image files directly out of the object storage bucket. The
bucket is configured to allow public reads of any object, because that was the fastest way to make
the CDN work. Privacy is enforced by the API deciding which URLs to put in a response, the file
itself is reachable by anyone who knows or guesses its URL.

**Share links.** A share link contains a 128-bit random token. The token maps to an album in the
database. Tokens do not expire and there is no record of how many times a link has been opened.

**The thumbnail worker.** It authenticates to object storage with a long-lived access key stored in
a file on its VM. That key has read and write access to the entire bucket, not just to new uploads.
The same key is also used by the API server, because it was copied over during setup.

**Logging.** The API writes one line per request to a local file on each VM: timestamp, user ID,
path, and status code. The files rotate weekly and are not copied anywhere else. Nobody reads them
unless something breaks. The admin console does not log which staff member did what, only that
"admin" did it.

**Backups.** The nightly dump is written to a second bucket. That bucket is not public. The dump is
not encrypted at rest beyond whatever the cloud provider does by default, and it has never been
restored to check that it works.

**Network.** All three VMs sit in one flat cloud network with no segmentation between them. The
database accepts connections from anything in that network. The API VMs and the worker VM all
accept SSH from the internet, with password authentication disabled and staff public keys
installed.

**Software updates.** The API's Python dependencies were pinned when the service launched
fourteen months ago and have not been updated since, because upgrading broke the image library once
and nobody went back to it.

## Data the system holds

- Account records: email address, password hash, display name, account creation date.
- Photos, and whatever is in them.
- Photo metadata straight from the camera, including GPS coordinates and capture time. The API
  stores this and never strips it.
- The friend graph: who is friends with whom.
- Access logs, as described above.

## Out of scope for Lab 2

You do not need to consider: the security of the cloud provider's own infrastructure, physical
attacks on the data centre, or attacks that require the attacker to already be an employee with
console access.
