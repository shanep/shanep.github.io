<!-- markdownlint-disable-next-line -->
## Configure GitHub

This section walks you through configuring your personal GitHub account so you can work
effectively from the command line in your future classes.

## Install the command line client

You can skip this task if you are working on one of the CS lab machines.
The gh command line tool is already installed for you.

Install the GitHub command line client [cli.github.com](https://cli.github.com/).

Windows users **MUST** reboot their machines. If you are on Windows, do not
continue until you have rebooted your machine. Once the gh tool is installed you
should be able to open a terminal and type **gh** as shown below.

```bash
$ gh
Work seamlessly with GitHub from the command line.

USAGE
  gh <command> <subcommand> [flags]

... Lots more output!
```

## Set Up Authorization

We want to configure our machine to use ssh keys using the command
`gh auth login`. Other tools and some integrated development environments (IDEs)
need ssh to work properly. This will ensure that your setup will work no
matter how you choose to write code 😃.

```bash
$ gh auth login
? Where do you use GitHub? GitHub.com
? What is your preferred protocol for Git operations on this host? SSH
? Generate a new SSH key to add to your GitHub account? Yes
? Enter a passphrase for your new SSH key (Optional):
? Title for your SSH key: GitHub CLI
? How would you like to authenticate GitHub CLI? Login with a web browser

! First copy your one-time code: XXXX-XXXX
Press Enter to open https://github.com/login/device in your browser...
✓ Authentication complete.
- gh config set -h github.com git_protocol ssh
✓ Configured git protocol
✓ Uploaded the SSH key to your GitHub account: /home/shane/.ssh/id_ed25519.pub
✓ Logged in as shanep
```

## Confirm everything works

We want to confirm that we have everything set up correctly. Luckily, the
command line tool has an option to do this for us. Run the command
`gh auth status` and you should see output similar to what is shown
below.

Your output will be slightly different depending on the OS and other
factors. You are not required to match the output exactly. You just need
to confirm that github.com is configured to use the ssh protocol.

```bash
$ gh auth status
github.com
  ✓ Logged in to github.com account shanep (keyring)
  - Active account: true
  - Git operations protocol: ssh
  - Token: gho_************************************
  - Token scopes: 'admin:public_key', 'gist', 'read:org', 'repo'
```

Congrats, you are now configured to use github.com with the ssh protocol!
