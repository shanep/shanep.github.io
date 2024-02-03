## Final Task - Submit your code

Now that you have completed all the tasks the only thing left to do is to submit your code as a
patch so you can receive a grade for all your hard work.

### Setup SMTP

::: info

If you are working in GitHub codespaces you will need to setup SMTP for **EACH** project. This is
because each codespace is tied to a specific repository and the settings are not shared. However,
if you are working on your own personal machine or in the CS Lab then you will only have to setup
SMTP once!

:::

- Turn on [Two factor
  authentication](https://support.google.com/accounts/answer/185839?hl=en&co=GENIE.Platform%3DDesktop)
  for your Boise State provided email account


::: danger

Do NOT skip the step above. Boise State University uses GMail as their email provider and GMail
requires you to use two factor authentication in order to generate an app password.

You need to use your Boise State University issued email account to send the email and you **must**
have two factor authentication turned on.

:::

In order to use [git send-email](https://git-scm.com/docs/git-send-email) you will need to generate
an app password. Navigate to
[https://security.google.com/settings/security/apppasswords](https://security.google.com/settings/security/apppasswords)
and generate a new app password. Make sure and copy the password before you close the window because
you will not be able to see it again.


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

Congrats you should be all setup to send code patch's over email. Now lets create a patch!

### Create a patch file

We are now going to do what is called a [squash
merge](https://docs.gitlab.com/ee/user/project/merge_requests/squash_and_merge.html) and then create
a patch file with all our changes in one commit.

- First lets fetch the upstream branch. This is the branch that you originally forked from at the
  start of the project

```bash
git fetch upstream
```
- Checkout a new branch named submit from the `upstream/master` branch.

```bash
git checkout upstream/master -b submit
```

- Now we will do a squash merge all the commits we did onto our new submit branch.

```bash
git merge --squash master
```

- Now commit those new changes to your submit branch

```bash
git commit -m "Submit project"
```

- Push your submit branch to GitHub

```bash
git push -u origin
```

- Open up a web browser and navigate to your repository on GitHub and confirm that your submit
  branch is correctly pushed. Open up the files and make sure that everything looks good before
  going to the next step.

![submit-branch](/images/git-submit-branch.png)

### Install Libraries

If you are working on codespaces you will need to install the required dependencies before you
attempt to email out your patch file.

```bash
make install-deps
```

### Email Patch File

First make sure you are still on the submit branch that you created. If you type `git branch` you
should see a start next to the submit branch that indicates you are currently on the submit branch.

```bash
$ git branch
  master
* submit
```

::: warning

You MUST test your patch by emailing it to your self first! You will go through all the steps below
with your **own** email. After you have sent the email to yourself and tested it you can then email
your submission to the class mailing list!

:::

Finally we can create our patch to email out!

```bash
git send-email --to youremail@u.boisestate.edu HEAD^
```

You should see results similar to what is show below.

```bash
$ git send-email --to youremail@u.boisestate.edu HEAD^
/tmp/T/NWEw4f1sIj/0001-Submit-project-2.patch

From: youremail@u.boisestate.edu
To:  youremail@u.boisestate.edu
Subject: [PATCH] Submit project
Date: Thu,  7 Dec 2023 20:31:55 -0700
Message-Id: <20231208033155.83099-1-shanepanter@boisestate.edu>
X-Mailer: git-send-email 2.39.3 (Apple Git-145)
MIME-Version: 1.0
Content-Transfer-Encoding: 8bit

The Cc list above has been expanded by additional
addresses found in the patch commit message. By default
send-email prompts before sending whenever this occurs.
This behavior is controlled by the sendemail.confirm
configuration setting.

For additional information, run 'git send-email --help'.
To retain the current behavior, but squelch this message,
run 'git config --global sendemail.confirm auto'.

Send this email? ([y]es|[n]o|[e]dit|[q]uit|[a]ll): y
OK. Log says:
Server: smtp.gmail.com
MAIL FROM:  youremail@u.boisestate.edu
RCPT TO:  youremail@u.boisestate.edu
RCPT TO:  youremail@u.boisestate.edu
From: youremail@u.boisestate.edu
To:  youremail@u.boisestate.edu
Subject: [PATCH] Submit project 2
Date: Thu,  7 Dec 2023 20:31:55 -0700
Message-Id: <20231208033155.83099-1-shanepanter@boisestate.edu>
X-Mailer: git-send-email 2.39.3 (Apple Git-145)
MIME-Version: 1.0
Content-Transfer-Encoding: 8bit

Result: 250
```

You should now be able to check your email and see your patch. Be aware that sometimes email
delivery is slightly delayed so you may have to wait a few minutes for it to show up. Make sure and
check your **spam** folder if you don't see any mail.

### Test your patch

You can now get your patch from GMail and test it to make sure that everything works and your patch
was correct.

- Checkout a new branch named `test-patch` from the upstream/master branch

```bash
git checkout upstream/master -b test-patch
```

- Push your new `test-patch` branch to **your** repo instead of the upstream

```bash
 git push -u origin
```

- Get the patch file from GMail

![download gmail](/images/gmail-original-email.png)


- Copy the email to your clip board

![copy to clipboard](/images/gmail-copy-email.png)

- Create a new file and paste the contents that you just copied and save it in the root folder in a
  file named `my-patch.txt`

![new file](/images/new-file.png)

- Make sure you saved the file correctly. It should show up in the file explorer as shown below.

![created file](/images/created-file.png)

- Now apply that patch to your new `test-patch` branch

```bash
git am my-patch.txt
```

- Commit your patch

```bash
git commit -m "Testing my email patch"
```

- Push your test patch branch to your Github Account

```bash
git push
```

- Finally open up the browser again and make sure you have 3 branches `master`, `submit`, and
  `test-patch`. The `submit` and `test-patch` branches should be identical. Each should have exactly
  1 commit from you will all your changes.

![final state](/images/final-repo-state.png)


### Submit your Patch for grading

Assuming you have successfully completed all the steps above with your own email and everything
looked good you can now submit your patch for grading.

::: danger

Do not use the class mailing list to test your patch. You should only send an email to **{{
$frontmatter.submit_email}}** after you have tested the process with your own email. Spamming the
mailing list with excessive patches will result in a lower grade.

When you submit to the mailing list you will automatically be cc'd on the email so you will have a
copy in your own email as proof that you completed the assignment.

You are allowed to submit up to 3 times without penalty.

:::

Open a terminal and submit your patch.


	git checkout submit
	git send-email --to {{ $frontmatter.submit_email}} HEAD^

Assuming all went well you are now complete! You have create a patch file from a squash merge,
emailed it and tested the resulting patch. You are well on your way to becoming an advanced
git user!
