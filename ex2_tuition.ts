// Exercise 2 — Polymorphic Tuition
//
// Run:  node ex2_tuition.ts
//
// Do not modify Student, UndergraduateStudent, or GraduateStudent.
// They are complete, and they are your model for the classes you write.

abstract class Student {
  private name: string;
  private id: string;
  private credits = 0;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  protected abstract getCreditLimit(): number;
  abstract calculateTuition(): number;

  addCredits(amount: number): boolean {
    if (!Number.isInteger(amount) || amount <= 0) return false;
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

class UndergraduateStudent extends Student {
  protected override getCreditLimit(): number {
    return 21;
  }

  override calculateTuition(): number {
    return this.getCredits() * 10000;
  }
}

class GraduateStudent extends Student {
  private advisor: string;

  constructor(name: string, id: string, advisor: string) {
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
    return `${super.describe()}, advisor: ${this.advisor}`;
  }

  getAdvisor(): string {
    return this.advisor;
  }
}

class ExchangeStudent extends Student {
  private homeUniversity: string;

  constructor(name: string, id: string, homeUniversity: string) {
    super(name, id);
    this.homeUniversity = homeUniversity;
  }

  // TODO 2.1 — An exchange student may take at most 15 credits.
  protected override getCreditLimit(): number {
    return 15;
  }

  // TODO 2.2 — Exchange students pay no tuition at DAUST: return 0.
  override calculateTuition(): number {
    return 0;
  }

  // TODO 2.3 — Override describe(). Reuse the parent's description, then append
  // ", home university: <homeUniversity>".
  override describe(): string {
    return `${super.describe()}, home university: ${this.homeUniversity}`;
  }
}

// TODO 2.4 — Complete DoctoralStudent:
//   - at most 9 credits
//   - a flat tuition of 200 000
//   - describe(): the parent's description followed by ", thesis: <thesis>"
class DoctoralStudent extends Student {
  private thesis: string;

  constructor(name: string, id: string, thesis: string) {
    super(name, id);
    this.thesis = thesis;
  }

  protected override getCreditLimit(): number {
    return 9;
  }

  override calculateTuition(): number {
    return 200000;
  }

  getThesis(): string {
    return this.thesis;
  }

  override describe(): string {
    return `${super.describe()}, thesis: ${this.thesis}`;
  }
}

// TODO 2.5 — The total tuition of a group of students.
// One loop, one call, no if.
function totalTuition(students: Student[]): number {
  let total=0;
  for(const student of students){
    total+=student.calculateTuition();
  }
  return total;
}

// TODO 2.6 — The student who pays the most tuition. Return undefined for an empty list.
function mostExpensive(students: Student[]): Student | undefined {
  
  if(students.length===0){
    return undefined;
  }
  let highest=0 ;
  let highestStud : Student = students[0];
  for(const student of students){
    if(student.calculateTuition()> highest){
      highestStud=student;
    }
  }
  return highestStud;
  
}

// TODO 2.7 — One line per student: "<description> -> <tuition>"
//   e.g. "Awa (S-001): 18 credits -> 180000"
function tuitionReport(students: Student[]): string[] {
  let studList: string[] = [];
  for(const student of students){
    studList.push(`${student.describe()} -> ${student.calculateTuition()}`);
  }
  return studList;
}

// TODO 2.8 — Declared type versus actual type. Uncomment the three lines below.
//   a) Before running: which version of calculateTuition() runs?
// --> the DoctoralStudent version of calculate tuition will run
//   b) Why is the last line underlined in red, although the object is a DoctoralStudent?
// --> because a Doctoral student is a student and a student doesnt contain get thesis
//   c) Fix the last line without changing the declared type of `someone`.
//      Hint: narrow the type with instanceof.
//
const someone: Student = new DoctoralStudent("Khady", "D-001", "Energy Systems in the Sahel");
console.log(someone.calculateTuition());
console.log((someone as DoctoralStudent).getThesis());

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

function makeGroup(): Student[] {
  const awa = new UndergraduateStudent("Awa", "S-001");
  const fatou = new GraduateStudent("Fatou", "G-001", "Dr. Diop");
  const ibrahima = new ExchangeStudent("Ibrahima", "E-001", "Université Laval");
  const khady = new DoctoralStudent("Khady", "D-001", "Energy Systems in the Sahel");
  awa.addCredits(18);
  fatou.addCredits(9);
  ibrahima.addCredits(12);
  khady.addCredits(6);
  return [awa, fatou, ibrahima, khady];
}

check("2.1 an exchange student may not exceed 15 credits", () => {
  const ibrahima = new ExchangeStudent("Ibrahima", "E-001", "Université Laval");
  return ibrahima.addCredits(15) === true && ibrahima.addCredits(1) === false;
});
check("2.2 an exchange student pays no tuition", () =>
  new ExchangeStudent("Ibrahima", "E-001", "Université Laval").calculateTuition() === 0);
check("2.3 an exchange student's description", () => {
  const ibrahima = new ExchangeStudent("Ibrahima", "E-001", "Université Laval");
  ibrahima.addCredits(12);
  return ibrahima.describe() === "Ibrahima (E-001): 12 credits, home university: Université Laval";
});
check("2.4 a doctoral student may not exceed 9 credits", () => {
  const khady = new DoctoralStudent("Khady", "D-001", "Energy Systems in the Sahel");
  return khady.addCredits(9) === true && khady.addCredits(1) === false;
});
check("2.4 a doctoral student's tuition", () =>
  new DoctoralStudent("Khady", "D-001", "Energy Systems in the Sahel").calculateTuition() === 200000);
check("2.4 a doctoral student's description", () => {
  const khady = new DoctoralStudent("Khady", "D-001", "Energy Systems in the Sahel");
  khady.addCredits(6);
  return khady.describe() === "Khady (D-001): 6 credits, thesis: Energy Systems in the Sahel";
});
check("2.5 total tuition of four kinds of student", () => totalTuition(makeGroup()) === 530000);
check("2.5 total tuition of an empty group", () => totalTuition([]) === 0);
check("2.6 the student who pays the most", () => mostExpensive(makeGroup())?.getCredits() === 6);
check("2.6 an empty group", () => mostExpensive([]) === undefined);
check("2.7 the tuition report", () =>
  tuitionReport(makeGroup()).join(" | ") ===
    "Awa (S-001): 18 credits -> 180000 | " +
    "Fatou (G-001): 9 credits, advisor: Dr. Diop -> 150000 | " +
    "Ibrahima (E-001): 12 credits, home university: Université Laval -> 0 | " +
    "Khady (D-001): 6 credits, thesis: Energy Systems in the Sahel -> 200000");

console.log(`\n${passed} / ${total} checks passed`);
