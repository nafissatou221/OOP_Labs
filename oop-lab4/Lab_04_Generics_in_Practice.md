# Object-Oriented Programming — DAUST Fall 2026

# Lab 4 — Generics in Practice

You will build a small library system. Along the way you will feel the problem generics solve, write a generic class with a constraint, decide when a generic is (and is not) needed, use a generic class as a part of another class, design a generic class on your own, and see the one thing generics cannot do.

Parts 1–5 are done in the session. Part 6, the open design task, is homework and is due with the deliverables.

Working method:

1. **Type the code yourself**, except where the lab says you may copy.
2. **Predict before you run.** Write each **Prediction** down before executing.
3. **Read every red underline.** `node` runs your code without type-checking it; the editor is the only type check.

## Setup

Create a folder `oop-lab4` and open it in VS Code. Add this `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "strict": true,
    "moduleDetection": "force",
    "noEmit": true
  }
}
```

`node` ignores this file. It tells VS Code to check strictly and to treat each file separately, so a `Book` class in one file does not clash with a `Book` class in another.

Run any file with:

```bash
node file.ts
```

---

## Part 1 — The Problem

Create `catalog.ts`. You may **copy** these two classes:

```typescript
class Book {
  private id: string;
  private title: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  getId(): string {
    return this.id;
  }

  describe(): string {
    return `${this.title} [${this.id}]`;
  }
}

class Member {
  private id: string;
  private name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}
```

The library needs a list of books and a list of members, both with the same rule: **no two entries share an ID.** Writing two nearly identical classes is tempting to avoid, so a teammate writes one list for everything:

```typescript
class AnyList {
  private items: any[] = [];

  add(item: any): boolean {
    if (this.find(item.getId()) !== undefined) return false;
    this.items.push(item);
    return true;
  }

  find(id: string): any {
    for (const item of this.items) {
      if (item.getId() === id) return item;
    }
    return undefined;
  }
}

const memberList = new AnyList();
memberList.add(new Member("M-01", "Awa"));

const awa = memberList.find("M-01");
console.log(awa.getName());
console.log(awa.describe());
```

**Prediction 1.** Is any line underlined in red? What happens when you run the file?

**Question 1.** The `any` version avoids writing two classes. What did it give up? Would `memberList.add(42)` be caught?

Delete `AnyList` and its test lines. Keep `Book` and `Member`.

---

## Part 2 — A Generic Catalog

### 2.1 Type Parameter and Constraint

**Task.** Write `class Catalog<T>` with:

- a private array `items` of type `T[]`
- `add(item: T): boolean`, which refuses an item whose ID is already present
- `find(id: string): T | undefined`
- `count(): number`

**Question 2.** Two lines are underlined in red, with the same message. Copy it. Why does TypeScript refuse to call `getId()` on a `T`?

Fix it by adding an interface and a constraint:

```typescript
interface HasId {
  getId(): string;
}

class Catalog<T extends HasId> {
```

Test:

```typescript
const books = new Catalog<Book>();
console.log(books.add(new Book("B-001", "Things Fall Apart")));
console.log(books.add(new Book("B-002", "So Long a Letter")));
console.log(books.add(new Book("B-001", "Another Copy")));

const members = new Catalog<Member>();
members.add(new Member("M-01", "Awa"));

console.log(books.count(), members.count());

const found = books.find("B-002");
if (found) console.log(found.describe());

const awa = members.find("M-01");
if (awa) console.log(awa.getName());

console.log(books.find("B-999"));
```

**Checkpoint 1** — no red underlines, and the output is:

```text
true
true
false
2 1
So Long a Letter [B-002]
Awa
undefined
```

**Question 3.** Neither `Book` nor `Member` says `implements HasId`. Why are they accepted?

### 2.2 Experiments

Add each line, copy the red underline, then delete the line:

```typescript
books.add(new Member("M-02", "Moussa"));   // (a)
const numbers = new Catalog<number>();     // (b)
console.log(found.describe());             // (c) without the if
```

**Question 4.** For each of (a), (b) and (c), say in one sentence which mistake TypeScript prevented, and which part of your code made that possible.

### 2.3 Change the Inside, Not the Outside

**Task.** Replace the array with `private items = new Map<string, T>();` and rewrite the methods with `has`, `set`, `get` and `size`. Then add:

```typescript
  all(): T[] {
    return Array.from(this.items.values());
  }
```

**Prediction 2.** Do any of the test lines need to change? Run and check that the output is still Checkpoint 1.

**Question 5.** Why did no test line change?

**Question 6.** Go back to the array version for a moment: suppose `all()` had simply returned `this.items`. Write one line of caller code that would then break the "no duplicate IDs" rule. Why does returning a new array prevent it?

---

## Part 3 — Generic or Not?

Create `fees.ts`. You may **copy** this starter:

```typescript
interface Borrowable {
  lateFee(daysLate: number): number;
}

abstract class LibraryItem implements Borrowable {
  private title: string;

  constructor(title: string) {
    this.title = title;
  }

  protected abstract feePerDay(): number;

  lateFee(daysLate: number): number {
    return daysLate * this.feePerDay();
  }

  describe(): string {
    return this.title;
  }
}

class Book extends LibraryItem {
  protected override feePerDay(): number {
    return 100;
  }
}

class Dvd extends LibraryItem {
  protected override feePerDay(): number {
    return 250;
  }
}

class Laptop implements Borrowable {
  private tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  lateFee(daysLate: number): number {
    return 5000 + daysLate * 1000;
  }
}

const novel = new Book("Things Fall Apart");
const film = new Dvd("Atlantics");
const laptop = new Laptop("LT-07");
```

### 3.1 A Total

**Task.** Write `totalFees(items: readonly Borrowable[], daysLate: number): number`. Test:

```typescript
console.log(totalFees([novel, film, laptop], 3));
console.log(totalFees([], 3));
```

**Checkpoint 2:**

```text
9050
0
```

### 3.2 The Most Costly Item

**Task.** Write `mostCostlyPlain(items: readonly Borrowable[], daysLate: number): Borrowable | undefined`, which returns the item with the highest late fee. Test:

```typescript
const plain = mostCostlyPlain([novel, film], 3);
if (plain) console.log(plain.describe());
```

**Question 7.** Copy the red underline. The item returned is a `Dvd`, which has `describe()`. Why can TypeScript not see it?

**Task.** Replace it with a **generic** `mostCostly`. Choose the type parameter, its constraint, and the return type yourself. This test must then compile and print `Atlantics`:

```typescript
const worst = mostCostly([novel, film], 3);
if (worst) console.log(worst.describe());
```

Now add:

```typescript
const worstOverall = mostCostly([novel, laptop], 3);
```

**Prediction 3.** What type will `worstOverall` have? Will `worstOverall.describe()` be accepted? Write your answers down, then hover over `worstOverall` and try the call.

Replace the `describe()` call with `if (worstOverall) console.log(worstOverall.lateFee(3));`. It prints `8000`.

**Question 8.** `totalFees` did not need a type parameter; `mostCostly` did. Complete the rule: *a generic is worth it when the function returns …* Then explain the type you saw in Prediction 3.

---

## Part 4 — A Generic Class as a Part

Create `reservations.ts`. Copy this queue:

```typescript
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  size(): number {
    return this.items.length;
  }
}
```

**Task 1.** Add `includes(item: T): boolean`. `new Queue<number>()` holding 10 and 20 must answer `true` for 20 and `false` for 30.

**Task 2.** Write a class `Book` that members can borrow and reserve:

- fields: `title`, `borrower` (`string | undefined`), and `reservations`, a `Queue<string>` of member names
- `borrow(member: string): boolean`
  - the member already has the book or is already waiting → `false`, nothing changes
  - nobody has the book → the member gets it, `true`
  - otherwise → the member joins the queue, `false`
- `giveBack(): boolean`
  - nobody has the book → `false`
  - otherwise → the book goes to the first member in the queue (or to nobody), `true`
- `getBorrower(): string | undefined` and `waiting(): number`

Test:

```typescript
const book = new Book("So Long a Letter");
console.log(book.borrow("Awa"), book.borrow("Moussa"), book.borrow("Fatou"));
console.log(book.getBorrower(), book.waiting());
console.log(book.borrow("Moussa"), book.waiting());
console.log(book.giveBack(), book.getBorrower(), book.waiting());
console.log(book.giveBack(), book.giveBack(), book.giveBack(), book.getBorrower());
```

**Checkpoint 3:**

```text
true false false
Awa 2
false 2
true Moussa 1
true true false undefined
```

**Question 9.** `Book` has no type parameter, yet it uses `Queue<T>`. Where is `T` chosen, and what is it? A teammate suggests `class Book extends Queue<string>` instead. Write one line of code that would then let someone skip the queue's rules.

**Question 10.** `borrow("Moussa")` returned `false` the first time, and `false` again the second time. What happened to Moussa in each case? What can the caller **not** tell from a `boolean`? (The next lecture gives better tools for this.)

**Task 3.** Draw a Mermaid class diagram of `Book` and `Queue~T~`, with members, the relationship between them, and multiplicities.

**Question 11.** Which relationship did you choose, and why?

---

## Part 5 — What Generics Cannot Do

Create `limits.ts`:

```typescript
class Book {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

function isA<T>(value: unknown): boolean {
  return value instanceof T;
}

console.log(isA<Book>(new Book("B-001")));
```

**Prediction 4.** Copy the red underline. Then run anyway: will it print `true`, `false`, or stop?

Replace the file with:

```typescript
type BookData = {
  id: string;
  title: string;
  copies: number;
};

function parseJson<T>(text: string): T {
  return JSON.parse(text);
}

const books = parseJson<BookData[]>('[{"id":"B-001","title":"Things Fall Apart"}]');
console.log(books[0].title);
console.log(books[0].copies + 1);
```

**Prediction 5.** There is no red underline. What do the two lines print?

**Question 12.** Explain both results with one fact about what happens to types when `node` runs a `.ts` file. Where must data from outside the program be checked?

---

## Part 6 — Your Turn: Design a Generic Class (Homework)

In `catalog.ts`, write `Ratings<T extends HasId>`, which lets readers rate any kind of item with stars:

- `rate(item: T, stars: number): boolean` accepts only a whole number from 1 to 5; anything else returns `false`
- `average(id: string): number | undefined` gives the average stars of an item, or `undefined` if it was never rated
- `best(): T | undefined` returns the item with the highest average, or `undefined` if nothing was rated

You decide how to store the data.

Test:

```typescript
const ratings = new Ratings<Book>();
const novel = new Book("B-001", "Things Fall Apart");
const letter = new Book("B-002", "So Long a Letter");

console.log(ratings.rate(novel, 5), ratings.rate(novel, 4), ratings.rate(letter, 4), ratings.rate(letter, 6), ratings.rate(letter, 4.5));
console.log(ratings.average("B-001"), ratings.average("B-002"), ratings.average("B-999"));

const top = ratings.best();
if (top) console.log(top.describe());

console.log(new Ratings<Member>().best());
```

**Checkpoint 4:**

```text
true true true false false
4.5 4 undefined
Things Fall Apart [B-001]
undefined
```

**Question 13.** `best()` returns `T`. What could the caller no longer do if it returned `HasId` instead?

---

## Deliverables

Push to your repository:

```text
oop-lab4/
├── tsconfig.json
├── catalog.ts        Parts 1–2 and 6
├── fees.ts           Part 3
├── reservations.ts   Part 4
├── limits.ts         Part 5
└── ANSWERS.md        your Predictions, Questions 1–13, and the Mermaid diagram from Part 4
```

Each `.ts` file must run with `node` and show no red underlines. (In `limits.ts`, keep the second version.)

---

## Summary

| You experienced | The name for it |
|---|---|
| `AnyList` crashed at runtime with no warning | `any` switches the checks off |
| `getId()` refused until `T extends HasId` | A constraint says what `T` must be able to do |
| A `Member` refused by `Catalog<Book>` | `T` is fixed when the object is created |
| Switching to a `Map` changed no test line | Encapsulation |
| `totalFees` needed no `T`; `mostCostly` did | Use a generic when the result's type depends on the input's |
| `[novel, laptop]` gave `Book \| Laptop` | Inference from mixed arguments |
| `Book` holding a `Queue<string>` | Composition with a generic part |
| `instanceof T` and `NaN` from `parseJson` | Types are erased at runtime |
