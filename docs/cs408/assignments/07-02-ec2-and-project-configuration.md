---
submission: online_url
---

# 07.02 - EC2 and Project Configuration

**Week 7 · 100 points · due Sat Oct 10, 11:59 PM**

## Overview

In this assignment you set up your project so that it runs the same way everywhere: on your laptop,
on your EC2 server, and on my machine when I grade it. Because everyone is using their own tech
stack, the details will differ for everyone, and most of the work is researching your particular
setup. Don't worry about messing anything up. If you brick your VM, delete it and create a fresh
one. In industry you will do this a lot.

**Example app:** [simple-full-stack](https://github.com/shanep/simple-full-stack). It is a Node.js
app, and it has every script this assignment asks for. If you use a different stack, keep the same
files and the same job for each one, and change what is inside them.

## What you need

- Your VM's public IP address. Get it from the AWS console, or ssh in and run
  `curl http://checkip.amazonaws.com`.
- The `.pem` key you downloaded in 07.01. Move it out of your Downloads folder to somewhere safe;
  you will use it often.
- The login user for your VM: `ubuntu` on the Ubuntu image from 07.01 (`ec2-user` only if you chose
  Amazon Linux).

::: danger
**Never commit your `.pem` key or a `.env` file to GitHub.** Bots scan GitHub for keys constantly,
and a leaked key gets your machine taken over within minutes. Add `*.pem` and `.env` to your
`.gitignore` before your first commit, as the example does.
:::

## Required files

Your repository must have these files, with exactly these names and in these places:

| File | What it does | Task |
|----|----|----|
| `start.sh` | Installs every dependency and starts the app on any machine | Task 1 |
| `deploy/setup-ec2.sh` | One-time setup of a fresh EC2 server, run **on the server** with sudo | Task 2 |
| `deploy/<your-app>.service` | The systemd unit that starts your app on boot and restarts it if it crashes | Task 2 |
| `deploy/deploy.sh` | Copies your code to the server and restarts it, run **from your laptop** | Task 3 |

## Task 1 - start.sh

Every project must have a `start.sh` script at the root of the repository. **I grade every
checkpoint by cloning your repository and running `./start.sh`**, so it has to work on a machine
that has never seen your project.

From a fresh clone, running `./start.sh` must:

1. Check that the tools your app needs are installed (for example the right version of Node, Python
    or Java, or a database server) and stop with a message naming what is missing, instead of a
    stack trace.
2. Install every project dependency (for example `npm install`, `pip install -r requirements.txt`,
    or `./mvnw install`).
3. Create anything the app needs before its first run, such as the database file or tables and any
    sample data.
4. Start the app and print the URL to open.

It must work on Linux, need no other manual steps, and be safe to run again. Your README lists the
tools a person must install first (step 1). Commit it as executable (`chmod +x start.sh`). The
example's `start.sh` shows all four steps.

## Task 2 - Set up the server: deploy/setup-ec2.sh

`deploy/setup-ec2.sh` prepares a fresh EC2 server. You run it **once, on the server**, not on your
laptop:

scp -i ~/keys/mykey.pem -r deploy ubuntu@\<PUBLIC-IP\>:~\
ssh -i ~/keys/mykey.pem ubuntu@\<PUBLIC-IP\>\
sudo bash deploy/setup-ec2.sh

It installs your runtime and nginx, creates a directory for the app, sets nginx to forward port 80
to your app, and installs your `deploy/<your-app>.service` file so systemd **starts the app on
boot**. Use the example's `setup-ec2.sh`, `todo-app.service` and `nginx-todo.conf` as your starting
point and change them for your stack.

## Task 3 - Deploy from your laptop: deploy/deploy.sh

`deploy/deploy.sh` runs **on your laptop** every time you want the server to have your latest code:

./deploy/deploy.sh -h \<PUBLIC-IP\> -i ~/keys/mykey.pem

The example's version runs your tests, copies your code to the server with `rsync`, installs
dependencies there, restarts the service, and then checks `http://<PUBLIC-IP>/api/health`. If your
app has no `/api/health` route, add one (it only has to return 200) or change that check to a page
your app has, or the script reports a failure even when the deploy worked.

## Task 4 - Run your app

1. Get a simple "Hello World" landing page running on your laptop with `./start.sh`.
2. Run `deploy/setup-ec2.sh` on the server (Task 2).
3. Deploy with `./deploy/deploy.sh` (Task 3).
4. Open `http://<PUBLIC-IP>/` in a browser and see your landing page.
5. Prove it starts on boot: run `sudo reboot` on the server, wait a minute, and load the page again
    without logging in.

**Your public IP changes if you stop and start the instance.** Rebooting keeps it. If it changes,
update the class spreadsheet.

## Submitting

1. Update the class spreadsheet from 07.01 with your public IP address.
2. Submit your live site's URL, `http://<PUBLIC-IP>/`, in the URL box below.

Your repository is the public one in the
[spreadsheet](https://docs.google.com/spreadsheets/d/1i7Q7-9iB72qxAtYEWuGTd-AL_2OAXnVBtsiBRLfutE0/edit?usp=sharing)
from 07.01. Each item below is either done or not done, and earns all of its points or none:

| Item | Done when | Points |
|----|----|----|
| **Live site** | The submitted URL shows your "Hello World" landing page. | 25 |
| **start.sh works** | A fresh clone of your repository installs everything and starts with `./start.sh` and no other steps. | 30 |
| **Server setup script** | `deploy/setup-ec2.sh` is in your repository. | 10 |
| **Starts on boot** | Your systemd `.service` file is in `deploy/`. | 10 |
| **Deploy script** | `deploy/deploy.sh` is in your repository. | 10 |
| **Spreadsheet IP** | Your row in the [spreadsheet](https://docs.google.com/spreadsheets/d/1i7Q7-9iB72qxAtYEWuGTd-AL_2OAXnVBtsiBRLfutE0/edit?usp=sharing) has the same public IP as the URL you submitted. | 5 |
| **No secrets committed** | No `.pem` key or `.env` file is in your repository. | 10 |
|  | **Total** | **100** |

## Rubric

| n | description | points |
| --- | --- | --- |
| 1 | Live site: The submitted URL shows your "Hello World" landing page. | 25 |
| 2 | start.sh works: A fresh clone of your repository installs everything and starts with ./start.sh and no other steps. | 30 |
| 3 | Server setup script: deploy/setup-ec2.sh is in your repository. | 10 |
| 4 | Starts on boot: Your systemd .service file is in deploy/. | 10 |
| 5 | Deploy script: deploy/deploy.sh is in your repository. | 10 |
| 6 | Spreadsheet IP: Your row in the spreadsheet has the same public IP as the URL you submitted. | 5 |
| 7 | No secrets committed: No .pem key or .env file is in your repository. | 10 |
