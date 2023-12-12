## Final Task - Submit your code

Now that you have completed all the tasks the only thing left to do is to submit your code as a
patch so you can receive a grade for all your hard work.

### Create a patch file

We are now going to do what is called a [squash
merge](https://docs.gitlab.com/ee/user/project/merge_requests/squash_and_merge.html) and then create
a patch file with all our changes in one commit.

- Checkout a new branch named submit from the `origin/master` branch.

```bash
git checkout origin/master -b submit
```

- Now we will do a squash merge onto our new submit branch.

```bash
git merge --squash master
```

- Now commit those new changes to your submit branch

```bash
git commit -m "Submit project"
```

This is what the whole sequence looks like.

```bash
shane|(submit=):git-send-email$ git merge --squash master
Updating 71c88c5..03028ce
Fast-forward
Squash commit -- not updating HEAD
 my-name.txt  | 1 +
 the-date.txt | 1 +
 2 files changed, 2 insertions(+)
 create mode 100644 my-name.txt
 create mode 100644 the-date.txt
shane|(submit +=):git-send-email$ git commit -m "Submit project"
[submit d9e1c85] Submit project 2
 2 files changed, 2 insertions(+)
 create mode 100644 my-name.txt
 create mode 100644 the-date.txt
shane|(submit>):git-send-email$ git status
On branch submit
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
```

### Install Libraries

If you are working on codespaces you will need to install the required dependencies.

```bash
make install-deps
```

### Email Patch File

Finally we can create our patch to email out!

	git send-email --to {{ $frontmatter.submit_email}} HEAD^

You should see results similar to what is show below.

	$ git send-email --to {{ $frontmatter.submit_email}} HEAD^
	/tmp/T/NWEw4f1sIj/0001-Submit-project-2.patch
	(mbox) Adding cc: Shane Panter <shanepanter@boisestate.edu>

	From: Shane Panter <shanepanter@boisestate.edu>
	To: {{ $frontmatter.submit_email}}
	Cc: Shane Panter <shanepanter@boisestate.edu>
	Subject: [PATCH] Submit project 2
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
	MAIL FROM:<shanepanter@boisestate.edu>
	RCPT TO: {{ $frontmatter.submit_email}}
	RCPT TO:<shanepanter@boisestate.edu>
	From: Shane Panter <shanepanter@boisestate.edu>
	To:  {{ $frontmatter.submit_email}}
	Cc: Shane Panter <shanepanter@boisestate.edu>
	Subject: [PATCH] Submit project 2
	Date: Thu,  7 Dec 2023 20:31:55 -0700
	Message-Id: <20231208033155.83099-1-shanepanter@boisestate.edu>
	X-Mailer: git-send-email 2.39.3 (Apple Git-145)
	MIME-Version: 1.0
	Content-Transfer-Encoding: 8bit

	Result: 250


You should now be able to check your email and see your patch because `git send-email` automatically
adds the author to the CC list.

### Submit Task 4 - Test your patch

You can now get your patch from GMail and test it to make sure that everything works and your patch
was correct.

- Checkout a new branch named `test-patch` from the origin/master branch

```bash
shane|(submit>):git-send-email$ git checkout origin/master -b test-patch
branch 'test-patch' set up to track 'origin/master'.
Switched to a new branch 'test-patch'
shane|(test-patch=):git-send-email$
```

- Get the patch file from GMail

![download gmail](/images/gmail-original-email.png)


- Copy the email to your clip board and then create a file in the repository named my-patch.txt and paste the contents
  into that file.

![copy to clipboard](/images/gmail-copy-email.png)

- Now apply that patch to your new `test-patch` branch

```bash
git am my-patch.txt
```

- This is an example of the complete process.

```bash
shane|(test-patch=):git-send-email$ ls
LICENSE      README.md    my-patch.txt
shane|(test-patch %=):git-send-email$ git am my-patch.txt
Applying: Submit project 2
shane|(test-patch %>):git-send-email$ git log
commit 7c547614e032064d2d0e8f0dbc0e8e8f22bb58f6 (HEAD -> test-patch)
Author: Shane Panter <shanepanter@boisestate.edu>
Date:   Thu Dec 7 20:31:55 2023 -0700

    Submit project 2

commit 71c88c58735532d679d7d51598b2b46b33d6c7e3 (origin/master, origin/HEAD)
Author: Shane K. Panter <shane@foundationcode.com>
Date:   Sun Dec 3 09:39:46 2023 -0700

    Initial commit
shane|(test-patch %>):git-send-email$ ls
LICENSE      README.md    my-name.txt  my-patch.txt the-date.txt
shane|(test-patch %>):git-send-email$ rm my-patch.txt
shane|(test-patch>):git-send-email$

```

Assuming all went well you are now complete! You have create a patch file from a squash merge and
then emailed and also tested the resulting email! You are well on your way to becoming an advanced
git user!

### Submit Final Task

Assuming you made it through all the previous tasks successfully you are now done!
There is nothing to submit on canvas for this assignment. Your email was your submission :)
