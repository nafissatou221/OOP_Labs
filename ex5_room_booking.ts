// Exercise 5 — A New Domain: Room Booking
//
// Run:  node ex5_room_booking.ts
//
// DAUST rents out rooms for events. Apply the same ideas to a domain you have
// not seen in the lectures. Do not modify the Room class.

abstract class Room {
  readonly name: string;
  private capacity: number;

  constructor(name: string, capacity: number) {
    this.name = name;
    this.capacity = capacity;
  }

  protected abstract hourlyRate(): number;

  canHost(people: number): boolean {
    return people <= this.capacity;
  }

  // The steps are fixed here. Each kind of room supplies its own hourly rate.
  bookingCost(hours: number): number {
    if (!Number.isInteger(hours) || hours <= 0) {
      throw new Error("Invalid duration");
    }
    return hours * this.hourlyRate();
  }
}

// TODO 5.1 — A classroom costs 5 000 per hour.
class Classroom extends Room {
  protected override hourlyRate(): number {
    throw new Error("TODO");
  }
}

// TODO 5.2 — A computer lab costs 15 000 per hour.
class ComputerLab extends Room {
  protected override hourlyRate(): number {
    throw new Error("TODO");
  }
}

// TODO 5.3 — An amphitheatre costs 25 000 per hour, plus a fixed setup fee of
// 20 000 per booking. Override bookingCost() and reuse the parent's calculation
// with super. Do not repeat the duration check.
class Amphitheatre extends Room {
  protected override hourlyRate(): number {
    throw new Error("TODO");
  }
}

// TODO 5.4 — Among the rooms that can host this many people, return the one
// with the lowest booking cost for this duration. Return undefined if none can.
function cheapestRoomFor(rooms: Room[], people: number, hours: number): Room | undefined {
  throw new Error("TODO");
}

// TODO 5.5 — A booking is a room and a number of hours.
// Complete the type, then return the total cost of all bookings.
type Booking = {
};

function totalCost(bookings: Booking[]): number {
  throw new Error("TODO");
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

function throws(action: () => unknown): boolean {
  try {
    action();
    return false;
  } catch (error) {
    return !(error instanceof Error && error.message === "TODO");
  }
}

const b12 = new Classroom("B12", 40);
const lab3 = new ComputerLab("Lab 3", 30);
const amphi = new Amphitheatre("Amphi A", 200);
const rooms: Room[] = [amphi, lab3, b12];

check("5.1 classroom cost", () => b12.bookingCost(2) === 10000);
check("5.2 computer lab cost", () => lab3.bookingCost(3) === 45000);
check("5.3 amphitheatre cost includes the setup fee", () => amphi.bookingCost(2) === 70000);
check("5.3 an invalid duration is still rejected", () => throws(() => amphi.bookingCost(0)));
check("5.4 the cheapest room for 25 people", () => cheapestRoomFor(rooms, 25, 2)?.name === "B12");
check("5.4 only the amphitheatre can host 150 people", () => cheapestRoomFor(rooms, 150, 2)?.name === "Amphi A");
check("5.4 no room can host 500 people", () => cheapestRoomFor(rooms, 500, 2) === undefined);
check("5.5 total cost of three bookings", () =>
  totalCost([
    { room: b12, hours: 2 },
    { room: lab3, hours: 3 },
    { room: amphi, hours: 2 },
  ] as Booking[]) === 125000);

console.log(`\n${passed} / ${total} checks passed`);
