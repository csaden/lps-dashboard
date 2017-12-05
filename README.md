# Academic Progress Dashboard

https://learning-progress-dashboard.herokuapp.com/

## About
The dashboard is designed in a way to help teachers and coaches reflect on student achievement and monitor academic progress. The dashboard allows to teachers to see how students are performing on Learning Targets (or Standards), which are considered to be a group of closely related topics. Each Learning Target (or Standard) can be assessed using one or more assessment. Assessments can be of any type (i.e exit ticket, quiz, test, paper) and should help learners and teachers determine whether or not each learner met the learning objective for a given assessment.

## Standards-based grading (SBG)
Standards-based grading involves measuring the proficiency of learners on well-defined course objectives (knowledge and skills).

https://www.competencyworks.org/analysis/what-is-the-difference-between-standards-based-grading/

[Peaks and Pits of Standards Based Grading](https://www.edutopia.org/blog/peaks-pits-standards-based-grading-josh-work)
[Problems with Standards Based Grading](https://www.edutopia.org/discussion/problem-standards-based-grading)

SBG and Mathematics
[WhenMathHappens](https://whenmathhappens.com/standards-based-grading/)
[Math Assessment Resource - Dan Meyer](http://blog.mrmeyer.com/2007/the-comprehensive-math-assessment-resource/)
[Assessments - Dan Meyer](http://blog.mrmeyer.com/category/assessment/)

### Schema
The dashboard could be used with any dataset that adheres to the following schema.

AssessmentID - unique assessment id
AssessmentTitle - name of the assessment to be displayed
CourseName - name of the name
Section - unique section id or name of a section (also called a class "Period")
StandardID - unique standard id
StandardTitle - name of the standard or learning target
StandardType - category of the standard such as academic or habit (executive functioning skills)
TeacherName - name of the teacher
StudentID - unique student id
FirstName - first name of the student taking the assessment
LastName - last name of the student taking the assessment
Score (assumed to be 0-100)
Weight - weight to the assessment (must be greater than zero)

### File upload

The dashboard currently only supports the upload of `.csv` files.

### Dependencies
- node@^6.9.4
- npm@^3.10.10

### Get Started
- `git clone` the repository
- `npm install`
- `npm start`

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### Create React App
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
