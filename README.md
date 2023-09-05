# Atllas Takehome

Welcome! We're excited that you’ve applied to be an engineer, and we’re looking forward to
evaluating your take-home! This project isn’t meant to be anything too scary, it’s just a way for
you to showcase your ability to write a simple, full-stack CRUD application.

This is a bit of a long read, but it’s all important information so make sure you take the time!

### Time Requirements

There are no hard time requirements. We expect it'll take around four hours, but everyone's
different and comfortable with different aspects, so you may take more or less. Just keep in mind
that we won't consider the next phase without the takehome being attempted, so we recommend not
taking more than a week.

### Tech Requirements

* You must use NextJS for the front-end. You are encouraged to use third-party libraries
  such as a form validation library for your own convenience.
* We have set up the front-end with the Tailwind CSS framework, which is what we use in our own
  product. You're not required to use Tailwind, but demonstrating proficiency with it is a plus.
* The back-end must be done with the provided express server. Add on to it as much as you’d like,
  but the assignment must be completed using express.
* You must implement your solution using the provided database schema, since this is what we'll be
  using to test your code. The schema is in `packages/back-end/src/services/db.ts`.

### Important Information

* We've provided a seed script that will scaffold the database with 100 users to test and prototype
  with: `npm run seed`.
* Once you’re ready for hand-off, there’s a script called “seed-prod” that adds 5,000 members. This
  is what we will be testing with, so it’d be a good idea to test it once with “production” data to
  make sure it meets your own expectations: `npm run seed-prod`.

# Assignment

You've been tasked with writing a back-office tool to display all members currently in the database.
Product owners have also signaled that they would like to be able to manage users (add, edit,
delete) and search through the database. Both POs also mentioned that they would like to be able to
do all this on their phone as well, since they find themselves out of the office quite a bit. With
this unfortunately vague set of requirements in mind, you've cobbled together a basic set of
user-stories and got them signed off on as adequate for MVP:

* As a user, I want to be able to use the application on both desktop and mobile.
* As a user, I want to be able to add a new user to the database.
* As a user, I want to be able to update a user in the database.
* As a user, I want to be able to delete a user from the database.
* As a user, I want to be able to sort the table.
* As a user, I want to be able to search the table.
* As a user, I want to be able to infintely scroll the table to view more users.

Outside of the task, there are also some engineering requirements:

* No lint issues - neither warnings nor errors.
* No type issues.

Basically, we must be able to build and run a production build on the first try.

When all’s said and done, you aren’t limited to just these requirements. As long as you complete the
user-stories, you’re free to add whatever else you want, but you’re not in any way required to do
anything extra. We’re not expecting anything outside of the user-stories and engineering
requirements, so it’s completely up to you as to how far you go.

# Submission

_Important: What we expect you submit is **not** just a zipped folder of your source tree._

There are a couple of things to do once you’re ready for hand-off. First and foremost, it’s
important to **make sure everything is committed to the “master” branch**. Once that’s done, run the
NPM script “prepare-submission” in the top-level of the workspace, and that will generate a binary
file called “submission.bundle”. Zip this file up and submit it
to [this google form](https://forms.gle/wLifwTeipsfshekw9).

# Questions/More Information

If you have any questions or concerns, please reach out to us
at [developers@atllas.com](mailto:developers@atllas.com?subject=[Atllas%20Takehome]%20) and include
“[Atllas Takehome]” in the subject line. We’ll be more than happy to answer your questions to the
best of our ability!

Thank you, and good luck!
