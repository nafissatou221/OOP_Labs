# Object-Oriented Programming — DAUST Fall 2026

# Practice Session — Polymorphism

**Follows:** Lecture 5 — *Polymorphism and Abstract Classes: One Call, Many Behaviours*
**Requires:** Node.js (v22+), VS Code

## How This Session Works

The folder contains five exercise files:

```text
ex1_fill_blanks.ts          fill in the missing keywords and calls
ex2_tuition.ts              complete two subclasses and three polymorphic functions
ex3_replace_the_chain.ts    move instanceof chains into the classes they belong to
ex4_interfaces.ts           polymorphism between unrelated classes
ex5_room_booking.ts         the same ideas in a new domain
```

Open the **folder** in VS Code (File → Open Folder), not individual files. Then run an exercise:

```bash
node ex2_tuition.ts
```

At the bottom of each file, checks test your work and print one status each:

```text
PASS    your code is correct
FAIL    your code runs but gives the wrong result
TODO    this part is not implemented yet
ERROR   your code crashed; the message says why
```

## Rules

1. Replace each `throw new Error("TODO");` with your implementation, and each `___` with the missing code.
2. Do not modify anything below the line **Checks — do not modify below this line**.
3. An exercise is finished when **every check passes and the file has no red underline**.
4. Work through the exercises in order. Each one builds on the previous.

Remember: `node` runs your code without type-checking it. The red underlines in VS Code are the only type check.

## Exercise 1 — Fill in the Blanks

The file contains 10 blanks written `___`. Each comment above a blank says what is missing: a keyword (`abstract`, `extends`, `override`, `super`) or a call.

This file **cannot run** until every blank is filled: `node` stops at the first `___`. Use the red underlines in VS Code to find the remaining blanks, then run the file.

Think about: blank 4 calls `this.getCreditLimit()` inside `Student`, where that method has no body. Which body runs?

## Exercise 2 — Polymorphic Tuition

`UndergraduateStudent` and `GraduateStudent` are complete: use them as models. Complete `ExchangeStudent`, write `DoctoralStudent`, then write three functions that work for every kind of student.

The functions `totalTuition`, `mostExpensive` and `tuitionReport` must contain no `if` that tests the kind of student, and no `instanceof`.

Think about: TODO 2.8 asks you to uncomment three lines. The object is a `DoctoralStudent`, yet `someone.getThesis()` is refused. What decides which methods you may call, and what decides which version runs?

## Exercise 3 — Replace the Chain

Two functions decide by asking each student what it is. They work today, and three checks already pass. Run the file before changing anything: which checks fail, and why?

Then move each decision into its class. When you make a method `abstract`, the compiler underlines every class that does not implement it yet. Follow those errors: they are your to-do list.

Think about: `scholarshipFor()` ends with `return 0`. Which class did that line silently belong to? What would happen to a new kind of student with the chain, and what happens with the abstract method?

## Exercise 4 — Polymorphism Through Interfaces

A student, a short-course participant, and a library member are unrelated classes. The finance office bills all three through one interface.

Complete `Billable` first (TODO 4.1). From that moment, the compiler reports what `LibraryMembership` is missing.

Think about: the checks pass an object literal, `guestLecture`, to `totalRevenue`. It is not an instance of any class. Why does TypeScript accept it? And why is `instanceof` acceptable in `listAdvisors` but not in `totalRevenue`?

## Exercise 5 — A New Domain: Room Booking

DAUST rents out rooms. `Room` is complete and must not be modified. Its `bookingCost()` fixes the steps; each kind of room supplies one detail.

Think about: the amphitheatre adds a setup fee. If you copied the body of `bookingCost()` instead of calling `super.bookingCost()`, what would happen the day DAUST changes the duration rule?

## If You Finish Early

1. In `ex5_room_booking.ts`, add a `MeetingRoom` at 3 000 per hour that offers the first hour free. Which method do you override, and do you need to modify `cheapestRoomFor` or `totalCost`?
2. In `ex4_interfaces.ts`, add a second interface, `Describable`, containing only `describe()`, and make `Billable` extend it. Which existing code must change?
