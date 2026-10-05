## Final Task - Submit your code

Now that you have completed all the tasks the only thing left to do is to create a submission report
and upload it to Canvas so you can receive a grade for all your hard work.

### Update your README

Open up `README.md` and fill in every section.

- Your name, email, and class section at the top
- **Known Bugs or Issues** - anything that does not work
- **Experience** - your struggles and breakthroughs with the project
- **Analysis** - only if the project asks for one, otherwise delete the section

### Check your build

Run the same commands that the continuous integration (CI) workflow runs and make sure you get a clean
build with no warnings, all tests passing, and no Address Sanitizer errors.

```bash
make clean
make all
make check
make leak-test
```

Then run `make report` and look at the coverage numbers at the bottom of the output. The
[grading rubric](grading-rubric.md) explains how coverage is graded.

### Push and check CI

Commit and push all your work.

```bash
git add --all
git commit -m "Finished the project"
git push
```

Open your repository on GitHub, click the **Actions** tab, then **Continuous Integration (CI)**, and
confirm that the run for your last push is green. If it is not, open the run, read the output, and
fix the problem.

### Create the submission report

1. In the **Actions** tab click **Create Submission Report Via GitHub Action**.
2. Click **Run workflow** and run it on the `master` branch.
3. Wait for the run to finish and then refresh your repository. You will now have a file named
   `submission-report.docx` that contains your README, the build output, the test results, the
   coverage report, the Address Sanitizer report, and all your code.
4. The workflow added a commit to your repository, so run `git pull` in your Codespace before you
   make any more changes. If you skip this your next push will be rejected.

::: danger

Do NOT edit the generated report. The report ends with a hash of its contents and any changes will be
reported as academic dishonesty. If something in the report is wrong, fix your code, push, and run
the workflow again.

:::

::: details GitHub Actions is down

If GitHub Actions is down, or the workflow hangs for more than 5 minutes, you can generate the report
on Onyx instead. Follow the steps in `docs/onyx.md` in your repository, which install
[gcovr](https://gcovr.com/) and run `scripts/create-submission-report.sh`.

:::

## Submitting

Download `submission-report.docx` from GitHub and submit it to Canvas. You can view your own
submission in Canvas, so open it and make sure everything looks right. Your grade will be updated
after the due date (and late window) have passed.
