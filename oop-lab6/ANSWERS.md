## Exercise 1
* (a) Which messages are returns?
-->(1)The user is asking to the enrollment service to drop a student in a course.
   (2)The Enrollment service asks for removing Student in a that course.
   (3) The course answers yes meaning we can remove that student.
   (4)The enrollment service asks for the credits of that student.
   (5)The course gives it and it is 6 credits.
   (6)The enrollment service removes the number of credits of that student.
   (7)Finally the enrollment service drops that student after everything being done.

* (b) Which operations must `Course` have, and which must `UndergraduateStudent` have? Give the message number of each.
-->`Course` must remove student(2), look(4) and give credits(5),return true if the student is removed(3)  and `UndergraduateStudent` must remove credits (6).

* (c) Suppose the student was never enrolled, so message 3 returns `false`. As drawn, what happens next to the student's credits? Which fragment would you add, and which message numbers would go inside it?
-->Student's credits would be undefined.I would add a break fragment (6) and would return undefined.

## Exercise 2

```mermaid
sequenceDiagram
    autonumber
    participant S as service: EnrollmentService
    participant E as enrollment:Enrollment
     Participant P as printer: Printer
     S->>E:new Enrollment(student,course)
     E-->>S: open?
     S->>P:printConfirmation(enrollment)
    
```
* (a) Why does the `enrollment` box appear lower than the other two?
-->

* (b) In UML, how is message 2 drawn: what kind of line, and what kind of arrowhead?
-->the message (2) is drawn as a dashed line,open arrow.

## Exercises 3
```mermaid
sequenceDiagram
    autonumber
    participant S as service: EnrollmentService
    participant C as course:Course
     participant L as lab: LabSession
     
     S->>C:hasLab()
     C-->>S: true 
     opt [course has lab]
     S->>L:reserveBench(student)
     end
```

### Exercise 4
```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant S as service: EnrollmentService
    participant C as course:Course
    participant W as waitlist: Waitlist
     
    U->>S:enroll(student,course)
    S->>C:hasSeatLeft()?
    C-->>S:open?
    alt seat left
    S->>C: addStudent(student) 
    S-->>U: enrolled
    else no seat left
    S->>W: add(student)
    S-->>U: waitlisted
    end
```
### Exercise 5
```mermaid
sequenceDiagram
    autonumber
    participant T as transcript: Transcript
    participant E as enrollment:Enrollment
     loop for each enrollment
     T->>E: getGrade()
     E-->>T: grade
     T->>E:getCredits()
     E-->>T:credits
     end
```
### Exercise 6
```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant S as service: EnrollmentService
    participant C as course:Course
    participant G as student: UndergraduateStudent
     
    U->>S:enroll(student,course)
    S->>C:getPrerequisite()?
    C-->>S:prereq
    S->>G: hasPassed(prereq)
    G-->>S: no
    break not passed
    S-->>U: missing prerequisite
    end
    G-->>S:yes
    S->>C:isOpen()
    C-->>S:open?
```

### Exercise 7
```mermaid
sequenceDiagram
    autonumber
    participant G as grades: GradeService
    participant S as student:Student
    participant A as advisor: Advisor
    par send both notification
    G->>S: notify(grade)
    and
    G->>A:notify(grade)
    end  
```

## Exercise 8
|Sentence from the requirements|Fragment|
|---|---|
|"For each course in the student's list, …"|loop|
|"If the student asked for a printed timetable, also print it."|alt|
|"The student pays the fees either by card or by bank transfer."|opt|
|"If registration is closed, refuse and stop."|break|
|"Email the student and the advisor at the same time."|par|

## Exercise 9
```mermaid
sequenceDiagram
    autonumber
    actor R as Registrar
    participant S as service: WaitlistService
    participant C as course:Course
    participant W as waitlist: Waitlist
    R->>S: promote(course,waitlist)
    S->>C:hasSeatLeft?
    C-->>S:open?
    alt no seat left
    S-->>R:undefined
    else seat left
    S->>W: next()
    W-->>S: next or undefined
    alt undefined
    S-->>R: undefined
    else next
    S->>C:addStudent(next)
    end
    end
    S-->>R:next 
```
## Exercise 10 
```` typescript 
enrollAll(student: Student, courses: Course[]): number{
    let acceptedCourses=0;
    for (const course of courses){
        if (course.isOpen()){
            const credits=course.getCredits();
            if(student.addCredits(credits)){
                acceptedCourses+=1;
            }
        }
    }
    return acceptedCourses;
}

````
## Exercise 11
|\#|Line of the diagram|What is wrong|Correction|
|---|---|---|---|
|1|S->>E: new Enrollment(student, course)|new enrollment must come after checking if the course is open |move it after isOpen() is true|
|2|C->>S: true|The message should use a dashed arrow|C-->>S|
|3|seats=seats-1|we must add student instead of removing seats|addStudent(student)|

* Corrected Diagram
```mermaid
sequenceDiagram
    actor U AS User
    participant S as service: EnrollmentService
    participant C as course: Course
    participant E as enrollment: Enrollment
    U->>S: enroll(student, course)
    S->>C: isOpen()
    C->>S: open?
    alt course is open
    S->>C:addStudent(student)
    S->>E: Enrollment(student,course)
    S-->>U: enrollment
    else course is closed
    S-->>U: undefined
    end
```