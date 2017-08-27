CS 546 W1 2017

Mitchell Freedman
Avikshith Pilly
Brandon Botsch
Pranay Lade

We pledge our honor that we have abided by the Stevens Honor System
			~MF ~AP ~BB ~PL

 .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
| .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
| |   ______     | || |      __      | || |   ______     | || |  ____  ____  | || |  _______     | || | _____  _____ | || |    _______   | |
| |  |_   __ \   | || |     /  \     | || |  |_   __ \   | || | |_  _||_  _| | || | |_   __ \    | || ||_   _||_   _|| || |   /  ___  |  | |
| |    | |__) |  | || |    / /\ \    | || |    | |__) |  | || |   \ \  / /   | || |   | |__) |   | || |  | |    | |  | || |  |  (__ \_|  | |
| |    |  ___/   | || |   / ____ \   | || |    |  ___/   | || |    \ \/ /    | || |   |  __ /    | || |  | '    ' |  | || |   '.___`-.   | |
| |   _| |_      | || | _/ /    \ \_ | || |   _| |_      | || |    _|  |_    | || |  _| |  \ \_  | || |   \ `--' /   | || |  |`\____) |  | |
| |  |_____|     | || ||____|  |____|| || |  |_____|     | || |   |______|   | || | |____| |___| | || |    `.__.'    | || |  |_______.'  | |
| |              | || |              | || |              | || |              | || |              | || |              | || |              | |
| '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  '----------------'  
ascii art image from "http://patorjk.com/software/taag/#p=testall&f=Blocks&t=papyrus%0A"

*** assuming your local host DB is clear
*** run "app.js" to start the server

This program is called Papyrus, it is intended to act as a platform by which teachers 
can organize their classes, students, and student's assignments. 

***To start we assume that each teacher and student has been given a unique 8 digit ID.*** 

When you access the site, you'll be brought to a login page. Here you can either 
login as a teacher or student or create a new student or teacher.

User Creation:
If we create a new account as a teacher or a student, we will need to provide:
	unique 8 digit ID, 
	first name,
	last name, 
	username, 
	password 
	corfirm password.
If there is an issue with the ID's or incorrect values, the system will inform the user

Login:
The login is the same for teachers and students, simply input your username and password. There is no
functioanlity for resetting your passwords or username, so please remember them!

Class Creation:
Now lets assume that we have just created a new teacher. A teacher can add a class to her roster.
To do such click the "create a class" button and provide a class name and manually enter a single student's unique ID. 
Add as many studnets ot the class as youd like. then click "create". The system will alert you if try to re-add a student
or add a student that already exists

As a student you cannot do anything until you have been assigned to a class. However if you have been 
assigned a class it will be visible once you login.

Announcment Creation:
As a teacher it is important that you can communicate with all your students, as such we have created the announcement option.
Once logged in as a teacher and have selected a class, click "create an announcement". Type in your announcement name and description.
Now all students currently enrolled in that class will recieve said announcement.

Assignment Creation:
If a teacher wishes to add an assignment to a class that all the students will be responsible for the must do that following. The teacher, 
once logged in and has selected a class, clicks the "add assignment" button. Next it will ask you for an assignment name, a prompt and a 
due date (by which you use a calendar to chose a date) 

Once added each student will be able to see the assignment.

Assignment ~ Student Submission:
If a student wishes to submit an assignment they must first recieve the assignment, read the promt and then upload a file containing their response.
Assuming the student has selected a file, they will click the submit button on the assignments page to upload to the server.

Assignment Revieved ~ Teacher: 
After a student submits an assignment, the teacher for that class will be able to download the assigment. 
Once downloaded the teacher can then review it and decide an appropriate grade. The Teacher can then supply a grade next to the 
submission of the assignment for each student. Additionally the teacher can leave a comment for the submission for the student to read. 
The Teacher must click update near the field they wish to update (either grade or comment) for the server to recognize there change.

The student will then be able to view their assignment grade from the grade page and assignment page. If they click on the assignment they will then 
be able to see any comments the teacher added if they added any.

Delete Class ~Teacher
As a teacher you have the ability to remove a class. Simply login and click on the class you wish to delete. Once there
click on the delete class button and the class will be deleted.

This should include a good overview for the project functionalities.

 
