interface Trackable {
  location(): string;
}

class Courier implements Trackable {
  private name: string;
  private position: string;

  constructor(name: string, position: string) {
    this.name = name;
    this.position = position;
  }

  getName(): string {
    return this.name;
  }

  moveTo(place: string): void {
    this.position = place;
  }

  location(): string {
    return this.position;
  }
}

class DeliveryBike implements Trackable {
  private plate: string;
  private gpsFix: string;

  constructor(plate: string, gpsFix: string) {
    this.plate = plate;
    this.gpsFix = gpsFix;
  }

  location(): string {
    return `${this.plate} at ${this.gpsFix}`;
  }
}



class DeliveryZone {
  private name: string;
  private couriers: Courier[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  addCourier(courier: Courier): void {
    this.couriers.push(courier);
  }

  removeCourier(courier: Courier): boolean {
    const index = this.couriers.indexOf(courier);
    if (index === -1) return false;
    this.couriers.splice(index, 1);
    return true;
  }

  firstAvailable(): Courier | undefined {
    return this.couriers[0];
  }
}

class Dispatcher {
  assign(orderRef: string, zone: DeliveryZone): string | undefined {
    const courier = zone.firstAvailable();
    if (courier === undefined) return undefined;
    return `${courier.getName()} takes ${orderRef} in ${zone.getName()}`;
  }
}

const moussa = new Courier("Moussa", "Plateau");
const bike = new DeliveryBike("DK-1234", "14.67N 17.43W");

const tracked: Trackable[] = [moussa, bike];
for (const t of tracked) console.log(t.location());


const plateau = new DeliveryZone("Plateau");
const medina = new DeliveryZone("Médina");
plateau.addCourier(moussa);
console.log(plateau.firstAvailable()?.getName());


plateau.removeCourier(moussa);
medina.addCourier(moussa);
moussa.moveTo("Médina");
console.log(plateau.firstAvailable()?.getName(), medina.firstAvailable()?.getName(), moussa.location());

const dispatcher = new Dispatcher();
console.log(dispatcher.assign("order #12", medina));
console.log(dispatcher.assign("order #13", plateau));