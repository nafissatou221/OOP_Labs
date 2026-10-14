// Exercise 4 — Polymorphism Through Interfaces
//
// Run:  node ex4_interfaces.ts
//
// The finance office bills students, short-course participants, and library
// members. These are unrelated classes: none of them extends another.

// TODO 4.1 — Anything the finance office can bill provides two methods:
//     calculateTuition(): number
//     describe(): string
interface Billable {
  calculateTuition(): number;
  describe(): string;
}

abstract class Student implements Billable {
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

  getAdvisor(): string {
    return this.advisor;
  }
}

// TODO 4.2 — A short-course participant pays a flat fee of 75 000.
//   describe() → "<name>, short course: <course>"
class ShortCourseParticipant implements Billable {
  private name: string;
  private course: string;

  constructor(name: string, course: string) {
    this.name = name;
    this.course = course;
  }

  calculateTuition(): number {
    return 75000;
  }

  describe(): string {
    return `${this.name}, short course: ${this.course}`;
  }
}

// TODO 4.3 — An external library member pays 5 000 per month.
//   describe() → "Library membership: <holder>, <months> months"
// Write both methods yourself. Once TODO 4.1 is done, the compiler tells you
// exactly what is missing.
class LibraryMembership implements Billable {
  private holder: string;
  private months: number;

  constructor(holder: string, months: number) {
    this.holder = holder;
    this.months = months;
  }
  calculateTuition(): number {
    return 5000*this.months;
  }
  describe(): string {
    return `Library membership: ${this.holder}, ${this.months} months`;
  }
}

// TODO 4.4 — The total of everything billed. One loop, no if, no instanceof.
function totalRevenue(items: Billable[]): number {
  let total=0;
  for(const item of items ){
    total+=item.calculateTuition();
  }
  return total;
}

// TODO 4.5 — One invoice line per item: "<description>: <amount> FCFA"
function invoiceLines(items: Billable[]): string[] {
  let itemList: string[] = [];
  for(const item of items){
    itemList.push(`${item.describe()}: ${item.calculateTuition()} FCFA`);
  }
  return itemList;
}

// TODO 4.6 — The advisors of the graduate students in a group, in order.
// Only GraduateStudent has getAdvisor(): this is a legitimate use of instanceof.
function listAdvisors(students: Student[]): string[] {
  let advList: string[]=[];
  for(const student of students){
    if(student instanceof GraduateStudent){
      advList.push(student.getAdvisor());
    }
  }
  return advList;
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

function makeAwa(): UndergraduateStudent {
  const awa = new UndergraduateStudent("Awa", "S-001");
  awa.addCredits(18);
  return awa;
}

const fatou = new GraduateStudent("Fatou", "G-001", "Dr. Diop");
const moussa = new ShortCourseParticipant("Moussa", "Cloud Fundamentals");
const aminata = new LibraryMembership("Aminata", 6);

// Not a class instance: an object literal with the right shape.
const guestLecture = {
  calculateTuition: () => 10000,
  describe: () => "Guest lecture: Ousmane",
};

check("4.2 short-course fee", () => moussa.calculateTuition() === 75000);
check("4.2 short-course description", () => moussa.describe() === "Moussa, short course: Cloud Fundamentals");
check("4.4 total across unrelated classes", () =>
  totalRevenue([makeAwa(), fatou, moussa]) === 405000);
check("4.4 any object with the right shape counts", () =>
  totalRevenue([moussa, guestLecture]) === 85000);
check("4.5 invoice lines", () =>
  invoiceLines([moussa, guestLecture]).join(" | ") ===
    "Moussa, short course: Cloud Fundamentals: 75000 FCFA | Guest lecture: Ousmane: 10000 FCFA");
check("4.6 advisors of graduate students only", () =>
  listAdvisors([makeAwa(), fatou, new GraduateStudent("Mamadou", "G-002", "Dr. Sow")]).join(",") ===
    "Dr. Diop,Dr. Sow");
check("4.6 a group without graduate students", () => listAdvisors([makeAwa()]).length === 0);

// Checks for TODO 4.3 use the object through Billable, so this file runs
// even before LibraryMembership is complete.
const membership: Billable = aminata;
check("4.3 library membership fee", () =>
  totalRevenue([membership]) === 30000);
check("4.3 library membership description", () =>
  invoiceLines([membership])[0] === "Library membership: Aminata, 6 months: 30000 FCFA");

console.log(`\n${passed} / ${total} checks passed`);
