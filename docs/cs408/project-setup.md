# Setup


![setup](images/setup.gif)

## Starter repo

Each team is expected to use the starter repo with the same layout. Your team needs to create a
public repo on Github with all team members as contributors.

## Repo Bookkeeping

Before we get started you will need to take care of some simple book keeping items for
your repo. You need to update the CONTRIBUTORS file with every team members University
provided email addresses (name@u.boisestate.edu) and update the license
that your team wants to use. You can read about all the different licenses
[here](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/licensing-a-repository)

Each team member needs to ensure they can push and pull commits to the repo.

## Team contract

You will need to create a team contract to use for the rest of the semester. The intent
of a team contract is to promote academic integrity and accountability among all team members.
The template that you will use is located in the root directory in the class starter repo.

You will be held accountable to the standards that the team comes up with during the semester
so make sure you understand what is expected of you. You should use the team contract template
as a jumping off point. Remember that the team contract is between the team members **not**
between the team and the instructor! The team contract will be used to resolve any conflicts that
arise over the semester.


## Continuous Integration

Keeping your code base healthy is an important part of the software
engineering process. For this class we will leverage
[Github Actions](https://github.com/features/actions) to test your
code.

For this lab you will **setup** some basic GitHub actions to build and
test your code. you must also document **how** you setup continuous
integration with your particular language and frameworks. If you are
working on a project where CI is not possible (Robotics, Unsupported
OS, etc.) then you must contact your instructor for
alternatives. Additionally, if you use other CI services such as
[travis-ci](https://travis-ci.org/) you must get instructor permission
first!

One cool feature of GitHub Actions the ability to have a [status
badge](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#adding-a-workflow-status-badge-to-your-repository)
that you can add to your README so your users can quickly know what
the status of your project is by just looking on GitHub. You need to
add a status badge to the README.md in your repository
showing at a minimum your build status. If your code does
not have a build (JavaScript, python, etc.) then you must show your
testing status instead. You can set up as many different badges as you
wish you are not just limited to one.

## Submission checklist

- Download the starter code and setupAccept the Github Classrooms Assignment
- Update the CONTRIBUTORS file with each students email.
- Choose and update your LICENSE file.
- team-contract.md is completed to the teams satisfaction
- Setup a github action to build and test your project on every commit
- Add a Status Badge to the root README.md
