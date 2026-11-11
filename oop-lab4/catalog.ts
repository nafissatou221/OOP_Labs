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

interface HasId {
  getId(): string;
}
class Catalog<T extends HasId> {
    private items = new Map<string, T>();
    add(item:T): boolean{
        if (this.items.has(item.getId())){
        return false;
        }
        this.items.set(item.getId(),item);
        return true;
     }
     
     find(id: string): T | undefined{
        return this.items.get(id);
        }
     
     count(): number {
        return this.items.size;
     }  
     all(): T[] {
    return Array.from(this.items.values());
  }
}


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

class Ratings<T extends HasId>{

  private ratings: Map<string, number[]>;
  private items: Map<string, T>;
  constructor(){
    this.ratings=new Map();
    this.items=new Map();
  }

  rate(item: T, stars: number): boolean{
    if(!Number.isInteger(stars)|| stars>5 || stars<=0){
      return false;
    }
    const id=item.getId();
    if(this.ratings.has(item.getId())){
      this.ratings.get(id)!.push(stars);
    }
    else{
      this.ratings.set(id,[stars]);
    }
    this.items.set(item.getId(),item);
    return true;
  }
  average(id: string): number | undefined{
    const stars=this.ratings.get(id);
    if(!stars){
      return undefined;
    }
    let sum=0;
    for(const star of stars){
      sum+=star;
    }
    return sum/stars.length;
  }
  best(): T | undefined{
    if (this.items.size===0){
      return undefined;
    }
    const firstID=this.items.keys().next().value!;
    let highest=this.average(firstID);
    let best=this.items.get(firstID);

    for(const [id,item] of this.items){
      if(this.average(id) !==undefined && this.average(id)!>highest!){
        highest=this.average(id);
        best=item;
      }
    }
    return best;
  }
}

const ratings = new Ratings<Book>();
const novel = new Book("B-001", "Things Fall Apart");
const letter = new Book("B-002", "So Long a Letter");

console.log(ratings.rate(novel, 5), ratings.rate(novel, 4), ratings.rate(letter, 4), ratings.rate(letter, 6), ratings.rate(letter, 4.5));
console.log(ratings.average("B-001"), ratings.average("B-002"), ratings.average("B-999"));

const top = ratings.best();
if (top) console.log(top.describe());

console.log(new Ratings<Member>().best());

