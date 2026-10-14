// Exercise 3 — Replace the Chain
//
// Run:  node ex3_replace_the_chain.ts
//
// The two functions scholarshipFor() and borrowingLimitFor() work today.
// They decide by asking each object what it is. Your job is to move each
// decision into the class it belongs to, then delete both functions.

abstract class Student {
  private name: string;
  private id: string;
  private credits = 0;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  protected abstract getCreditLimit(): number;

  // TODO 3.1 — Replace this method with an abstract one:
  //     abstract calculateScholarship(): number;
  // As soon as you do, the compiler underlines every subclass that does not
  // implement it. Those red underlines are your to-do list.
  abstract calculateScholarship(): number ;

  // TODO 3.2 — Do the same for the library's borrowing limit:
  //     abstract getBorrowingLimit(): number;
  abstract getBorrowingLimit(): number ;

  addCredits(amount: number): boolean {
    if (!Number.isInteger(amount) || amount <= 0) return false;
    if (this.credits + amount > this.getCreditLimit()) return false;
    this.credits += amount;
    return true;
  }

  describe(): string {
    return `${this.name} (${this.id}): ${this.credits} credits`;
  }
}

class UndergraduateStudent extends Student {
  protected override getCreditLimit(): number {
    return 21;
  }
  override calculateScholarship(): number {
    return 20000;
  }
  override getBorrowingLimit(): number {
    return 5;
  }
}

class GraduateStudent extends Student {
  protected override getCreditLimit(): number {
    return 12;
  }
  override calculateScholarship(): number {
    return 50000;
  }
  override getBorrowingLimit(): number {
    return 10;
  }
}

class ExchangeStudent extends Student {
  protected override getCreditLimit(): number {
    return 15;
  }
  override calculateScholarship(): number {
    return 0;
  }
  override getBorrowingLimit(): number {
    return 3;
  }
}

// Move each branch into its class (TODO 3.1), then delete this function.
// Careful: the final "return 0" hides a decision. Which class does it belong to?
// -->it belongs to the class ExchangeStudent


// Move each branch into its class (TODO 3.2), then delete this function.


// TODO 3.3 — Rewrite this function so that it no longer uses scholarshipFor().
function totalScholarships(students: Student[]): number {
  let total = 0;
  for (const student of students) {
    total += student.calculateScholarship();
  }
  return total;
}

// TODO 3.4 — Rewrite this function so that it no longer uses borrowingLimitFor().
function canBorrow(student: Student, booksAlreadyBorrowed: number): boolean {
  return booksAlreadyBorrowed < student.getBorrowingLimit();
}

// ---------------------------------------------------------------
// Checks — do not modify below this line
// ---------------------------------------------------------------

let passed = 0;
let total = 0;

function check(label: string, test: () => boolean): void {
  total++;
  try {
    if (test()) {
      passed++;
      console.log(`PASS  ${label}`);
    } else {
      console.log(`FAIL  ${label}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message === "TODO" ? `TODO  ${label}` : `ERROR ${label} (${message})`);
  }
}

// A kind of student that did not exist when totalScholarships() was written.
class VisitingStudent extends Student {
  protected override getCreditLimit(): number {
    return 6;
  }

  override calculateScholarship(): number {
    return 10000;
  }

  override getBorrowingLimit(): number {
    return 2;
  }
}

const awa = new UndergraduateStudent("Awa", "S-001");
const fatou = new GraduateStudent("Fatou", "G-001");
const ibrahima = new ExchangeStudent("Ibrahima", "E-001");
const yacine = new VisitingStudent("Yacine", "V-001");

check("3.1 undergraduate scholarship", () => awa.calculateScholarship() === 20000);
check("3.1 graduate scholarship", () => fatou.calculateScholarship() === 50000);
check("3.1 exchange scholarship", () => ibrahima.calculateScholarship() === 0);
check("3.2 borrowing limits", () =>
  awa.getBorrowingLimit() === 5 && fatou.getBorrowingLimit() === 10 && ibrahima.getBorrowingLimit() === 3);
check("3.3 total scholarships", () => totalScholarships([awa, fatou, ibrahima]) === 70000);
check("3.3 works for a class it has never seen", () => totalScholarships([awa, yacine]) === 30000);
check("3.4 can borrow below the limit", () => canBorrow(awa, 4) === true);
check("3.4 cannot borrow at the limit", () => canBorrow(awa, 5) === false);
check("3.4 works for a class it has never seen", () => canBorrow(yacine, 1) === true && canBorrow(yacine, 2) === false);

console.log(`\n${passed} / ${total} checks passed`);
