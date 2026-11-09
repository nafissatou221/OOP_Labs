**Prediction 1.** Is any line underlined in red? What happens when you run the file?
-->no it is not underlined, when we run the file the `awa.describe()` won't run because the function describe does not exist.


**Question 1.** The `any` version avoids writing two classes. What did it give up? Would `memberList.add(42)` be caught?
--> it gives up the type safety because when we want to write a string for example and we write a number instead, there won't have error. So the type safety is not here when we use any. No,`memberList.add(42)` will not be caught.

**Question 2.** Two lines are underlined in red, with the same message. Copy it. Why does TypeScript refuse to call `getId()` on a `T`?
-->Property 'getId' does not exist on type 'T'.
-->Because it doesn't know if T has `getId()`.

**Question 3.** Neither `Book` nor `Member` says `implements HasId`. Why are they accepted?
-->They are accepted because both of them has the `getID()` method.

**Question 4.** For each of (a), (b) and (c), say in one sentence which mistake TypeScript prevented, and which part of your code made that possible.
--> (a) Type 'Member' is missing the following properties from type 'Book': title, describe; The book parameter doesnt accept `Member` object and the type parameter Book provides this protection.
-->(b) Type 'number' does not satisfy the constraint 'HasId'. `HasID` must return a string so if we have a number it will be an error and `T extends HasId` prevent from it.
--> (c) 'found' is possibly 'undefined'. Since found may be undefined, we may need to check if it exist before we describe it and  `if (found)` prevents from it.

**Prediction 2.** Do any of the test lines need to change? Run and check that the output is still Checkpoint 1.
-->no, they don.t need to change.

**Question 5.** Why did no test line change?
-->because we kept the same interface, we only change the implementation of the array.

**Question 6.** Go back to the array version for a moment: suppose `all()` had simply returned `this.items`. Write one line of caller code that would then break the "no duplicate IDs" rule. Why does returning a new array prevent it?
-->returning a new array prevents it because if not, we would have direct access to catalog rules.

**Question 7.** Copy the red underline. The item returned is a `Dvd`, which has `describe()`. Why can TypeScript not see it?
-->Property 'describe' does not exist on type 'Borrowable'.
--> because the type of `mostCostlyPlain` is `Borrowable` or `undefined`, and in Borrowable we have the interface lateFee(), describe is not there, so typescript cannot see that it has a describle method.

**Prediction 3.** What type will `worstOverall` have? Will `worstOverall.describe()` be accepted? Write your answers down, then hover over `worstOverall` and try the call.
-->it will be a `Book|Laptop|Undefined` and won,t be accepted because the describe method does not exist on the Laptop type.


**Question 8.** `totalFees` did not need a type parameter; `mostCostly` did. Complete the rule: *a generic is worth it when the function returns …* Then explain the type you saw in Prediction 3
-->a generic is worth it when the function returns a type depending on the input type
--> in  prediction 3, we had as type `Book|Laptop|Undefined` because `novel` is a Book, `laptop` is a Laptop and if it is empty we have undefined.

**Question 9.** `Book` has no type parameter, yet it uses `Queue<T>`. Where is `T` chosen, and what is it? A teammate suggests `class Book extends Queue<string>` instead. Write one line of code that would then let someone skip the queue's rules.
-->T is chosen when we create the queun inside book,here it is a string because it stores names.
--> one example of skipping the queue's rule can be book.enqueue(nafi), it will add without checking the requirements.


**Question 10.** `borrow("Moussa")` returned `false` the first time, and `false` again the second time. What happened to Moussa in each case? What can the caller **not** tell from a `boolean`? (The next lecture gives better tools for this.)
--> the first false is because awa already had the book; the second one is because we cannot add him again since he is already waiting

**Task 3.** Draw a Mermaid class diagram of `Book` and `Queue~T~`, with members, the relationship between them, and multiplicities.

**Question 11.** Which relationship did you choose, and why?

**Prediction 4.** Copy the red underline. Then run anyway: will it print `true`, `false`, or stop?
-->'T' only refers to a type, but is being used as a value here.
-->stop

**Prediction 5.** There is no red underline. What do the two lines print?
-->it will print: Things Fall Apart ; undefined

**Question 12.** Explain both results with one fact about what happens to types when `node` runs a `.ts` file. Where must data from outside the program be checked?
-->