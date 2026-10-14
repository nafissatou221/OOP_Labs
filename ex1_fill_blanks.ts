// Exercise 1 — Fill in the Blanks
//
// Run:  node ex1_fill_blanks.ts
//
// Replace every ___ with the right keyword or expression. There are 10 blanks.
// The file runs only when every blank is filled. Until then, VS Code underlines
// each blank in red: use the underlines to find them.

// Blank 1 — Student must never be instantiated directly.
abstract class Student {
  private name: string;
  private id: string;
  private credits = 0;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  // Blank 2 — Every subclass must provide its own limit. There is no default.
  protected abstract getCreditLimit(): number;

  // Blank 3 — The same for tuition.
  abstract calculateTuition(): number;

  addCredits(amount: number): boolean {
    if (!Number.isInteger(amount) || amount <= 0) return false;
    // Blank 4 — Call the method that each subclass supplies.
    if (this.credits + amount > this.getCreditLimit()) return false;
    this.credits += amount;
    return true;
  }

  getCredits(): number {
    return this.credits;
  }

  describe(): string {
    return `${this.name} (${this.id}): ${this.credits} credits`;
  }
}

// Blank 5 — An undergraduate student is a Student.
class UndergraduateStudent extends Student {
  // Blank 6 — This method replaces one declared in the parent.
  protected override getCreditLimit(): number {
    return 21;
  }

  override calculateTuition(): number {
    // Blank 7 — 10 000 per credit. `credits` is private in Student: use its public method.
    return this.getCredits() * 10000;
  }
}

class GraduateStudent extends Student {
  private advisor: string;

  constructor(name: string, id: string, advisor: string) {
    // Blank 8 — Build the Student part of the object first.
    super(name, id);
    this.advisor = advisor;
  }

  protected override getCreditLimit(): number {
    return 12;
  }

  override calculateTuition(): number {
    return 150000;
  }

  override describe(): string {
    // Blank 9 — Reuse the parent's description.
    return `${super.describe()}, advisor: ${this.advisor}`;
  }
}

// Blank 10 — One call, whatever the kind of student.
function totalTuition(students: Student[]): number {
  let total = 0;
  for (const student of students) {
    total += student.calculateTuition();
  }
  return total;
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

check("an undergraduate may take 21 credits, not 22", () => {
  const awa = new UndergraduateStudent("Awa", "S-001");
  return awa.addCredits(18) === true && awa.addCredits(3) === true && awa.addCredits(1) === false;
});
check("a graduate student may not exceed 12 credits", () => {
  const fatou = new GraduateStudent("Fatou", "G-001", "Dr. Diop");
  return fatou.addCredits(9) === true && fatou.addCredits(6) === false;
});
check("undergraduate tuition: 10 000 per credit", () => {
  const awa = new UndergraduateStudent("Awa", "S-001");
  awa.addCredits(18);
  return awa.calculateTuition() === 180000;
});
check("a graduate student's description", () => {
  const fatou = new GraduateStudent("Fatou", "G-001", "Dr. Diop");
  fatou.addCredits(9);
  return fatou.describe() === "Fatou (G-001): 9 credits, advisor: Dr. Diop";
});
check("total tuition of a mixed group", () => {
  const awa = new UndergraduateStudent("Awa", "S-001");
  const fatou = new GraduateStudent("Fatou", "G-001", "Dr. Diop");
  awa.addCredits(18);
  return totalTuition([awa, fatou]) === 330000;
});

console.log(`\n${passed} / ${total} checks passed`);
