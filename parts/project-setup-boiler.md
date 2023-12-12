## Task 1 - Setup

Follow the steps below to get your repository all setup and ready to use. The steps below show you
how to use and setup GitHub codespaces. You are not required to use codespaces, all the steps below can be
completed in the CS Lab or on your personal machine if you prefer.

### Fork the starter repository

- Fork the starter repository into your personal GitHub account: **{{$frontmatter.repo}}**


![fork repo](/images/fork-the-repo.png)

### Start a new Codespace

We will use GitHub Codespaces to do most of our coding. Codespaces is just VSCode in the cloud. This
makes it really easy to setup a developer environment and code from any computer that has a browser
and internet connection!

![Start Codespace](/images/start-codespace.png)

### Setup SMTP

::: info

If you are working in GitHub codespaces you will need to setup SMTP for **EACH** project. This is
because each codespace is tied to a specific repository and the settings are not shared. However,
if you are working on your own personal machine or in the CS Lab then you will only have to setup
SMTP once!

:::

In order to use [git send-email](https://git-scm.com/docs/git-send-email) you will need to generate
an app password. Navigate to
[https://security.google.com/settings/security/apppasswords](https://security.google.com/settings/security/apppasswords)
and generate a new app password. Make sure and copy the password before you close the window because
you will not be able to see it again.

::: warning
Make sure you use your university supplied email when generating your password. Do not use your
personal Gmail account or you will not receive a grade on the assignment.

You will need to save this password somewhere safe you can't access the password after you close the window.
:::

![generate app password](/images/gen-app-password.png)

- Open up a terminal in codespaces

![Open Terminal](/images/open-terminal.png)

- In the terminal type `git config --global --edit` and modify the file with the info listed below.
You will need to change the info listed below to match your own name, email and Password that you
generated in the previous step.

```text
[User]
	name =  YOUR NAME
	email = YOURNAME@u.boisestate.edu
[sendemail]
	smtpserver = smtp.gmail.com
	smtpuser = YOURNAME@u.boisestate.edu
	smtpPass = xxxx xxxx xxxx xxxx
	smtpencryption = ssl
	smtpserverport = 465
```

![Edit config](/images/edit-config.png)

Congrats you should be all setup to send code patch's over email. Move on to the next task to get
started with the assignment.
