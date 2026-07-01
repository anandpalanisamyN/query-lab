/* College SQL Practice Lab */

const STORAGE_KEY = 'collegeSqlPractice_completed';

const TABLE_SCHEMAS = {
  college_departments: [
    { name: 'dept_id', type: 'INT', key: 'PK' },
    { name: 'dept_name', type: 'VARCHAR(50)', key: '' },
    { name: 'building', type: 'VARCHAR(50)', key: '' },
    { name: 'head_staff_id', type: 'INT', key: 'FK → college_staff' },
  ],
  college_years: [
    { name: 'year_id', type: 'INT', key: 'PK' },
    { name: 'year_name', type: 'VARCHAR(20)', key: '' },
    { name: 'start_date', type: 'DATE', key: '' },
    { name: 'end_date', type: 'DATE', key: '' },
  ],
  college_staff: [
    { name: 'staff_id', type: 'INT', key: 'PK' },
    { name: 'staff_name', type: 'VARCHAR(80)', key: '' },
    { name: 'dept_id', type: 'INT', key: 'FK → college_departments' },
    { name: 'role', type: 'VARCHAR(30)', key: '' },
    { name: 'salary', type: 'DECIMAL(10,2)', key: '' },
    { name: 'hire_date', type: 'DATE', key: '' },
  ],
  college_students: [
    { name: 'student_id', type: 'INT', key: 'PK' },
    { name: 'student_name', type: 'VARCHAR(80)', key: '' },
    { name: 'dept_id', type: 'INT', key: 'FK → college_departments' },
    { name: 'year_id', type: 'INT', key: 'FK → college_years' },
    { name: 'enrollment_date', type: 'DATE', key: '' },
    { name: 'gpa', type: 'DECIMAL(3,2)', key: '' },
  ],
  college_courses: [
    { name: 'course_id', type: 'INT', key: 'PK' },
    { name: 'course_name', type: 'VARCHAR(80)', key: '' },
    { name: 'dept_id', type: 'INT', key: 'FK → college_departments' },
    { name: 'credits', type: 'INT', key: '' },
    { name: 'staff_id', type: 'INT', key: 'FK → college_staff' },
  ],
  college_enrollments: [
    { name: 'enrollment_id', type: 'INT', key: 'PK' },
    { name: 'student_id', type: 'INT', key: 'FK → college_students' },
    { name: 'course_id', type: 'INT', key: 'FK → college_courses' },
    { name: 'semester', type: 'VARCHAR(20)', key: '' },
    { name: 'grade', type: 'VARCHAR(2)', key: '' },
  ],
  college_exams: [
    { name: 'exam_id', type: 'INT', key: 'PK' },
    { name: 'course_id', type: 'INT', key: 'FK → college_courses' },
    { name: 'exam_name', type: 'VARCHAR(60)', key: '' },
    { name: 'exam_date', type: 'DATE', key: '' },
    { name: 'max_marks', type: 'INT', key: '' },
  ],
  college_exam_results: [
    { name: 'result_id', type: 'INT', key: 'PK' },
    { name: 'exam_id', type: 'INT', key: 'FK → college_exams' },
    { name: 'student_id', type: 'INT', key: 'FK → college_students' },
    { name: 'marks_obtained', type: 'INT', key: '' },
  ],
};

const ER_DIAGRAM = `college_departments ──< college_staff
college_departments ──< college_students
college_departments ──< college_courses
college_years ──< college_students
college_staff ──< college_courses (instructor)
college_students ──< college_enrollments >── college_courses
college_courses ──< college_exams
college_exams ──< college_exam_results >── college_students`;

const INIT_SQL = `
CREATE TABLE college_departments (
  dept_id INT PRIMARY KEY,
  dept_name VARCHAR(50),
  building VARCHAR(50),
  head_staff_id INT
);

CREATE TABLE college_years (
  year_id INT PRIMARY KEY,
  year_name VARCHAR(20),
  start_date DATE,
  end_date DATE
);

CREATE TABLE college_staff (
  staff_id INT PRIMARY KEY,
  staff_name VARCHAR(80),
  dept_id INT,
  role VARCHAR(30),
  salary DECIMAL(10,2),
  hire_date DATE
);

CREATE TABLE college_students (
  student_id INT PRIMARY KEY,
  student_name VARCHAR(80),
  dept_id INT,
  year_id INT,
  enrollment_date DATE,
  gpa DECIMAL(3,2)
);

CREATE TABLE college_courses (
  course_id INT PRIMARY KEY,
  course_name VARCHAR(80),
  dept_id INT,
  credits INT,
  staff_id INT
);

CREATE TABLE college_enrollments (
  enrollment_id INT PRIMARY KEY,
  student_id INT,
  course_id INT,
  semester VARCHAR(20),
  grade VARCHAR(2)
);

CREATE TABLE college_exams (
  exam_id INT PRIMARY KEY,
  course_id INT,
  exam_name VARCHAR(60),
  exam_date DATE,
  max_marks INT
);

CREATE TABLE college_exam_results (
  result_id INT PRIMARY KEY,
  exam_id INT,
  student_id INT,
  marks_obtained INT
);

INSERT INTO college_departments VALUES
(1, 'Computer Science', 'Block A', 1),
(2, 'Mathematics', 'Block B', 4),
(3, 'Physics', 'Block C', 6),
(4, 'English', 'Block D', 8);

INSERT INTO college_years VALUES
(1, '2022-23', '2022-08-01', '2023-05-31'),
(2, '2023-24', '2023-08-01', '2024-05-31'),
(3, '2024-25', '2024-08-01', '2025-05-31');

INSERT INTO college_staff VALUES
(1, 'Dr. Alice Chen', 1, 'Professor', 95000.00, '2015-03-10'),
(2, 'Prof. Bob Kumar', 1, 'Associate Professor', 78000.00, '2018-06-01'),
(3, 'Dr. Carol White', 1, 'Assistant Professor', 65000.00, '2020-01-15'),
(4, 'Dr. David Lee', 2, 'Professor', 92000.00, '2012-09-01'),
(5, 'Prof. Emma Brown', 2, 'Lecturer', 55000.00, '2019-02-20'),
(6, 'Dr. Frank Miller', 3, 'Professor', 88000.00, '2014-11-05'),
(7, 'Prof. Grace Taylor', 3, 'Lecturer', 52000.00, '2021-07-12'),
(8, 'Dr. Henry Adams', 4, 'Professor', 75000.00, '2016-04-18');

INSERT INTO college_students VALUES
(101, 'John Smith', 1, 2, '2023-08-15', 3.45),
(102, 'Sarah Johnson', 1, 2, '2023-08-16', 3.80),
(103, 'Mike Wilson', 1, 3, '2024-08-10', 2.90),
(104, 'Emily Davis', 2, 2, '2023-08-14', 3.60),
(105, 'Chris Lee', 2, 3, '2024-08-11', 3.10),
(106, 'Anna Martinez', 3, 2, '2023-08-17', 3.25),
(107, 'Tom Anderson', 3, 3, '2024-08-09', 2.75),
(108, 'Lisa Wang', 1, 1, '2022-08-20', 3.90),
(109, 'James Brown', 4, 2, '2023-08-18', 3.15),
(110, 'Nina Patel', 4, 3, '2024-08-12', 3.55);

INSERT INTO college_courses VALUES
(201, 'Database Systems', 1, 4, 1),
(202, 'Data Structures', 1, 3, 2),
(203, 'Operating Systems', 1, 4, 3),
(204, 'Calculus I', 2, 4, 4),
(205, 'Linear Algebra', 2, 3, 5),
(206, 'Mechanics', 3, 4, 6),
(207, 'Thermodynamics', 3, 3, 7),
(208, 'English Literature', 4, 3, 8);

INSERT INTO college_enrollments VALUES
(1, 101, 201, 'Fall 2023', 'A'),
(2, 101, 202, 'Fall 2023', 'B'),
(3, 102, 201, 'Fall 2023', 'A'),
(4, 102, 203, 'Spring 2024', 'A'),
(5, 103, 202, 'Fall 2024', 'C'),
(6, 104, 204, 'Fall 2023', 'B'),
(7, 104, 205, 'Spring 2024', 'A'),
(8, 105, 204, 'Fall 2024', 'B'),
(9, 106, 206, 'Fall 2023', 'A'),
(10, 107, 206, 'Fall 2024', 'B'),
(11, 108, 201, 'Fall 2022', 'A'),
(12, 108, 202, 'Spring 2023', 'A'),
(13, 109, 208, 'Fall 2023', 'B'),
(14, 110, 208, 'Fall 2024', 'A'),
(15, 101, 203, 'Spring 2024', 'B');

INSERT INTO college_exams VALUES
(301, 201, 'Midterm', '2023-10-15', 100),
(302, 201, 'Final', '2023-12-10', 100),
(303, 202, 'Midterm', '2023-10-20', 50),
(304, 204, 'Final', '2023-12-05', 100),
(305, 206, 'Midterm', '2023-11-01', 75),
(306, 208, 'Final', '2023-12-15', 100);

INSERT INTO college_exam_results VALUES
(1, 301, 101, 85),
(2, 301, 102, 92),
(3, 301, 108, 98),
(4, 302, 101, 78),
(5, 302, 102, 95),
(6, 302, 108, 88),
(7, 303, 101, 42),
(8, 303, 102, 48),
(9, 303, 108, 50),
(10, 304, 104, 72),
(11, 305, 106, 68),
(12, 306, 109, 81);
`;

const PRACTICE_QUESTIONS = [
  {
    id: 1,
    category: 'SELECT',
    difficulty: 'easy',
    question: 'List all students with their names and GPA.',
    hint: 'Use SELECT with column names from the college_students table.',
    template: 'SELECT student_name, gpa FROM college_students;',
    solution: 'SELECT student_name, gpa FROM college_students;',
  },
  {
    id: 2,
    category: 'SELECT',
    difficulty: 'easy',
    question: 'Show all columns from the college_departments table.',
    hint: 'Use SELECT * to retrieve every column.',
    template: 'SELECT * FROM college_departments;',
    solution: 'SELECT * FROM college_departments;',
  },
  {
    id: 3,
    category: 'WHERE',
    difficulty: 'easy',
    question: 'Find all students with GPA greater than 3.5.',
    hint: 'Use WHERE gpa > 3.5',
    template: 'SELECT * FROM college_students WHERE gpa > 3.5;',
    solution: 'SELECT * FROM college_students WHERE gpa > 3.5;',
  },
  {
    id: 4,
    category: 'WHERE',
    difficulty: 'medium',
    question: 'Find staff members with salary between 60000 and 80000.',
    hint: 'Use BETWEEN 60000 AND 80000',
    template: 'SELECT staff_name, salary FROM college_staff WHERE salary BETWEEN 60000 AND 80000;',
    solution: 'SELECT staff_name, salary FROM college_staff WHERE salary BETWEEN 60000 AND 80000;',
  },
  {
    id: 5,
    category: 'WHERE',
    difficulty: 'medium',
    question: 'Find all courses whose name contains the word "Data".',
    hint: 'Use LIKE with wildcards: LIKE \'%Data%\'',
    template: "SELECT * FROM college_courses WHERE course_name LIKE '%Data%';",
    solution: "SELECT * FROM college_courses WHERE course_name LIKE '%Data%';",
  },
  {
    id: 6,
    category: 'WHERE',
    difficulty: 'medium',
    question: 'List students enrolled in department 1 (Computer Science).',
    hint: 'Filter college_students table by dept_id = 1',
    template: 'SELECT student_name, gpa FROM college_students WHERE dept_id = 1;',
    solution: 'SELECT student_name, gpa FROM college_students WHERE dept_id = 1;',
  },
  {
    id: 7,
    category: 'ORDER BY',
    difficulty: 'easy',
    question: 'List all students ordered by GPA in descending order.',
    hint: 'Use ORDER BY gpa DESC',
    template: 'SELECT student_name, gpa FROM college_students ORDER BY gpa DESC;',
    solution: 'SELECT student_name, gpa FROM college_students ORDER BY gpa DESC;',
  },
  {
    id: 8,
    category: 'ORDER BY',
    difficulty: 'medium',
    question: 'Show the top 3 highest-paid staff members.',
    hint: 'Use ORDER BY salary DESC LIMIT 3',
    template: 'SELECT staff_name, salary FROM college_staff ORDER BY salary DESC LIMIT 3;',
    solution: 'SELECT staff_name, salary FROM college_staff ORDER BY salary DESC LIMIT 3;',
  },
  {
    id: 9,
    category: 'DISTINCT',
    difficulty: 'easy',
    question: 'List all unique semesters from the college_enrollments table.',
    hint: 'Use SELECT DISTINCT semester',
    template: 'SELECT DISTINCT semester FROM college_enrollments;',
    solution: 'SELECT DISTINCT semester FROM college_enrollments;',
  },
  {
    id: 10,
    category: 'DISTINCT',
    difficulty: 'medium',
    question: 'Find all unique grades given in enrollments.',
    hint: 'SELECT DISTINCT grade FROM college_enrollments',
    template: 'SELECT DISTINCT grade FROM college_enrollments;',
    solution: 'SELECT DISTINCT grade FROM college_enrollments;',
  },
  {
    id: 11,
    category: 'Aggregate',
    difficulty: 'easy',
    question: 'Count the total number of students.',
    hint: 'Use COUNT(*)',
    template: 'SELECT COUNT(*) AS total_students FROM college_students;',
    solution: 'SELECT COUNT(*) AS total_students FROM college_students;',
  },
  {
    id: 12,
    category: 'Aggregate',
    difficulty: 'easy',
    question: 'Find the average GPA of all students.',
    hint: 'Use AVG(gpa)',
    template: 'SELECT AVG(gpa) AS avg_gpa FROM college_students;',
    solution: 'SELECT AVG(gpa) AS avg_gpa FROM college_students;',
  },
  {
    id: 13,
    category: 'Aggregate',
    difficulty: 'medium',
    question: 'Find the highest and lowest salary among staff.',
    hint: 'Use MAX(salary) and MIN(salary)',
    template: 'SELECT MAX(salary) AS max_salary, MIN(salary) AS min_salary FROM college_staff;',
    solution: 'SELECT MAX(salary) AS max_salary, MIN(salary) AS min_salary FROM college_staff;',
  },
  {
    id: 14,
    category: 'Aggregate',
    difficulty: 'medium',
    question: 'Find the total credits offered across all courses.',
    hint: 'Use SUM(credits)',
    template: 'SELECT SUM(credits) AS total_credits FROM college_courses;',
    solution: 'SELECT SUM(credits) AS total_credits FROM college_courses;',
  },
  {
    id: 15,
    category: 'GROUP BY',
    difficulty: 'medium',
    question: 'Count how many students belong to each department.',
    hint: 'GROUP BY dept_id with COUNT(*)',
    template: 'SELECT dept_id, COUNT(*) AS student_count FROM college_students GROUP BY dept_id;',
    solution: 'SELECT dept_id, COUNT(*) AS student_count FROM college_students GROUP BY dept_id;',
  },
  {
    id: 16,
    category: 'GROUP BY',
    difficulty: 'medium',
    question: 'Find the average GPA for each department.',
    hint: 'GROUP BY dept_id, use AVG(gpa)',
    template: 'SELECT dept_id, AVG(gpa) AS avg_gpa FROM college_students GROUP BY dept_id;',
    solution: 'SELECT dept_id, AVG(gpa) AS avg_gpa FROM college_students GROUP BY dept_id;',
  },
  {
    id: 17,
    category: 'HAVING',
    difficulty: 'hard',
    question: 'Find departments that have more than 2 students.',
    hint: 'GROUP BY dept_id HAVING COUNT(*) > 2',
    template: 'SELECT dept_id, COUNT(*) AS cnt FROM college_students GROUP BY dept_id HAVING COUNT(*) > 2;',
    solution: 'SELECT dept_id, COUNT(*) AS cnt FROM college_students GROUP BY dept_id HAVING COUNT(*) > 2;',
  },
  {
    id: 18,
    category: 'HAVING',
    difficulty: 'hard',
    question: 'Find courses with average enrollment grade "A" count greater than 1 (courses with more than 1 A grade).',
    hint: 'Join college_enrollments with college_courses, filter grade = A, GROUP BY course, HAVING COUNT > 1',
    template: `SELECT c.course_name, COUNT(*) AS a_count
FROM college_enrollments e
JOIN college_courses c ON e.course_id = c.course_id
WHERE e.grade = 'A'
GROUP BY c.course_id, c.course_name
HAVING COUNT(*) > 1;`,
    solution: `SELECT c.course_name, COUNT(*) AS a_count
FROM college_enrollments e
JOIN college_courses c ON e.course_id = c.course_id
WHERE e.grade = 'A'
GROUP BY c.course_id, c.course_name
HAVING COUNT(*) > 1;`,
  },
  {
    id: 19,
    category: 'INNER JOIN',
    difficulty: 'medium',
    question: 'Show student names along with their department names.',
    hint: 'JOIN college_students with college_departments ON dept_id',
    template: `SELECT s.student_name, d.dept_name
FROM college_students s
INNER JOIN college_departments d ON s.dept_id = d.dept_id;`,
    solution: `SELECT s.student_name, d.dept_name
FROM college_students s
INNER JOIN college_departments d ON s.dept_id = d.dept_id;`,
  },
  {
    id: 20,
    category: 'INNER JOIN',
    difficulty: 'medium',
    question: 'List course names with the instructor (staff) name who teaches them.',
    hint: 'JOIN college_courses with college_staff ON staff_id',
    template: `SELECT c.course_name, st.staff_name
FROM college_courses c
INNER JOIN college_staff st ON c.staff_id = st.staff_id;`,
    solution: `SELECT c.course_name, st.staff_name
FROM college_courses c
INNER JOIN college_staff st ON c.staff_id = st.staff_id;`,
  },
  {
    id: 21,
    category: 'INNER JOIN',
    difficulty: 'hard',
    question: 'Show student name, course name, and grade for all enrollments.',
    hint: 'Join college_students, college_enrollments, and college_courses',
    template: `SELECT s.student_name, c.course_name, e.grade
FROM college_enrollments e
INNER JOIN college_students s ON e.student_id = s.student_id
INNER JOIN college_courses c ON e.course_id = c.course_id;`,
    solution: `SELECT s.student_name, c.course_name, e.grade
FROM college_enrollments e
INNER JOIN college_students s ON e.student_id = s.student_id
INNER JOIN college_courses c ON e.course_id = c.course_id;`,
  },
  {
    id: 22,
    category: 'LEFT JOIN',
    difficulty: 'hard',
    question: 'List all departments and their head of department name (include departments even if head is not set).',
    hint: 'LEFT JOIN college_departments with college_staff on head_staff_id',
    template: `SELECT d.dept_name, s.staff_name AS head_name
FROM college_departments d
LEFT JOIN college_staff s ON d.head_staff_id = s.staff_id;`,
    solution: `SELECT d.dept_name, s.staff_name AS head_name
FROM college_departments d
LEFT JOIN college_staff s ON d.head_staff_id = s.staff_id;`,
  },
  {
    id: 23,
    category: 'LEFT JOIN',
    difficulty: 'hard',
    question: 'List all students and their exam marks (include students with no exam results).',
    hint: 'LEFT JOIN college_students → college_exam_results',
    template: `SELECT s.student_name, er.marks_obtained
FROM college_students s
LEFT JOIN college_exam_results er ON s.student_id = er.student_id;`,
    solution: `SELECT s.student_name, er.marks_obtained
FROM college_students s
LEFT JOIN college_exam_results er ON s.student_id = er.student_id;`,
  },
  {
    id: 24,
    category: 'Subquery',
    difficulty: 'medium',
    question: 'Find students whose GPA is above the overall average GPA.',
    hint: 'WHERE gpa > (SELECT AVG(gpa) FROM college_students)',
    template: `SELECT student_name, gpa
FROM college_students
WHERE gpa > (SELECT AVG(gpa) FROM college_students);`,
    solution: `SELECT student_name, gpa
FROM college_students
WHERE gpa > (SELECT AVG(gpa) FROM college_students);`,
  },
  {
    id: 25,
    category: 'Subquery',
    difficulty: 'hard',
    question: 'Find staff who earn more than the average salary in their department.',
    hint: 'Compare salary to subquery AVG grouped by dept',
    template: `SELECT s.staff_name, s.salary, s.dept_id
FROM college_staff s
WHERE s.salary > (
  SELECT AVG(s2.salary) FROM college_staff s2 WHERE s2.dept_id = s.dept_id
);`,
    solution: `SELECT s.staff_name, s.salary, s.dept_id
FROM college_staff s
WHERE s.salary > (
  SELECT AVG(s2.salary) FROM college_staff s2 WHERE s2.dept_id = s.dept_id
);`,
  },
  {
    id: 26,
    category: 'IN / NOT IN',
    difficulty: 'medium',
    question: 'Find students who are enrolled in course 201 (Database Systems).',
    hint: 'WHERE student_id IN (SELECT student_id FROM college_enrollments WHERE course_id = 201)',
    template: `SELECT student_name
FROM college_students
WHERE student_id IN (
  SELECT student_id FROM college_enrollments WHERE course_id = 201
);`,
    solution: `SELECT student_name
FROM college_students
WHERE student_id IN (
  SELECT student_id FROM college_enrollments WHERE course_id = 201
);`,
  },
  {
    id: 27,
    category: 'IN / NOT IN',
    difficulty: 'hard',
    question: 'Find students who have never received grade "C".',
    hint: 'WHERE student_id NOT IN (... WHERE grade = C)',
    template: `SELECT student_name
FROM college_students
WHERE student_id NOT IN (
  SELECT student_id FROM college_enrollments WHERE grade = 'C'
);`,
    solution: `SELECT student_name
FROM college_students
WHERE student_id NOT IN (
  SELECT student_id FROM college_enrollments WHERE grade = 'C'
);`,
  },
  {
    id: 28,
    category: 'EXISTS',
    difficulty: 'hard',
    question: 'Find departments that have at least one student with GPA above 3.7.',
    hint: 'Use EXISTS with correlated subquery',
    template: `SELECT d.dept_name
FROM college_departments d
WHERE EXISTS (
  SELECT 1 FROM college_students s
  WHERE s.dept_id = d.dept_id AND s.gpa > 3.7
);`,
    solution: `SELECT d.dept_name
FROM college_departments d
WHERE EXISTS (
  SELECT 1 FROM college_students s
  WHERE s.dept_id = d.dept_id AND s.gpa > 3.7
);`,
  },
  {
    id: 29,
    category: 'CASE',
    difficulty: 'medium',
    question: 'Label each student as "Honors" if GPA >= 3.5, else "Standard".',
    hint: 'Use CASE WHEN gpa >= 3.5 THEN ... ELSE ... END',
    template: `SELECT student_name, gpa,
  CASE WHEN gpa >= 3.5 THEN 'Honors' ELSE 'Standard' END AS standing
FROM college_students;`,
    solution: `SELECT student_name, gpa,
  CASE WHEN gpa >= 3.5 THEN 'Honors' ELSE 'Standard' END AS standing
FROM college_students;`,
  },
  {
    id: 30,
    category: 'CASE',
    difficulty: 'hard',
    question: 'Categorize staff salary as "High" (>80000), "Medium" (60000-80000), or "Low" (<60000).',
    hint: 'Nested CASE or multiple WHEN conditions',
    template: `SELECT staff_name, salary,
  CASE
    WHEN salary > 80000 THEN 'High'
    WHEN salary >= 60000 THEN 'Medium'
    ELSE 'Low'
  END AS salary_band
FROM college_staff;`,
    solution: `SELECT staff_name, salary,
  CASE
    WHEN salary > 80000 THEN 'High'
    WHEN salary >= 60000 THEN 'Medium'
    ELSE 'Low'
  END AS salary_band
FROM college_staff;`,
  },
  {
    id: 31,
    category: 'Multi-table',
    difficulty: 'hard',
    question: 'For each exam, show exam name, course name, and average marks obtained.',
    hint: 'Join college_exams, college_courses, college_exam_results; GROUP BY exam',
    template: `SELECT e.exam_name, c.course_name, AVG(er.marks_obtained) AS avg_marks
FROM college_exams e
JOIN college_courses c ON e.course_id = c.course_id
JOIN college_exam_results er ON e.exam_id = er.exam_id
GROUP BY e.exam_id, e.exam_name, c.course_name;`,
    solution: `SELECT e.exam_name, c.course_name, AVG(er.marks_obtained) AS avg_marks
FROM college_exams e
JOIN college_courses c ON e.course_id = c.course_id
JOIN college_exam_results er ON e.exam_id = er.exam_id
GROUP BY e.exam_id, e.exam_name, c.course_name;`,
  },
  {
    id: 32,
    category: 'Multi-table',
    difficulty: 'hard',
    question: 'Find the student(s) with the highest marks in any single exam.',
    hint: 'Find MAX(marks_obtained) then join back',
    template: `SELECT s.student_name, er.marks_obtained, e.exam_name
FROM college_exam_results er
JOIN college_students s ON er.student_id = s.student_id
JOIN college_exams e ON er.exam_id = e.exam_id
WHERE er.marks_obtained = (SELECT MAX(marks_obtained) FROM college_exam_results);`,
    solution: `SELECT s.student_name, er.marks_obtained, e.exam_name
FROM college_exam_results er
JOIN college_students s ON er.student_id = s.student_id
JOIN college_exams e ON er.exam_id = e.exam_id
WHERE er.marks_obtained = (SELECT MAX(marks_obtained) FROM college_exam_results);`,
  },
  {
    id: 33,
    category: 'INSERT',
    difficulty: 'medium',
    question: 'Insert a new student: ID 111, name "Raj Sharma", dept 1, year 3, enrolled 2024-08-13, GPA 3.40.',
    hint: 'INSERT INTO college_students VALUES (...)',
    template: `INSERT INTO college_students VALUES (111, 'Raj Sharma', 1, 3, '2024-08-13', 3.40);`,
    solution: `INSERT INTO college_students VALUES (111, 'Raj Sharma', 1, 3, '2024-08-13', 3.40);`,
    validateWithSelect: 'SELECT * FROM college_students WHERE student_id = 111;',
    expectedRows: 1,
  },
  {
    id: 34,
    category: 'UPDATE',
    difficulty: 'medium',
    question: 'Update Mike Wilson (student_id 103) GPA to 3.00.',
    hint: 'UPDATE college_students SET gpa = 3.00 WHERE student_id = 103',
    template: 'UPDATE college_students SET gpa = 3.00 WHERE student_id = 103;',
    solution: 'UPDATE college_students SET gpa = 3.00 WHERE student_id = 103;',
    validateWithSelect: 'SELECT gpa FROM college_students WHERE student_id = 103;',
    expectedResult: [[3]],
  },
  {
    id: 35,
    category: 'DELETE',
    difficulty: 'hard',
    question: 'Delete the enrollment record with enrollment_id = 15.',
    hint: 'DELETE FROM college_enrollments WHERE enrollment_id = 15',
    template: 'DELETE FROM college_enrollments WHERE enrollment_id = 15;',
    solution: 'DELETE FROM college_enrollments WHERE enrollment_id = 15;',
    validateWithSelect: 'SELECT COUNT(*) AS cnt FROM college_enrollments WHERE enrollment_id = 15;',
    expectedResult: [[0]],
  },
  {
    id: 36,
    category: 'UNION',
    difficulty: 'medium',
    question: 'Create a list of all names (students and staff) with a type label.',
    hint: 'SELECT name, type UNION ALL ...',
    template: `SELECT student_name AS name, 'Student' AS type FROM college_students
UNION ALL
SELECT staff_name AS name, 'Staff' AS type FROM college_staff;`,
    solution: `SELECT student_name AS name, 'Student' AS type FROM college_students
UNION ALL
SELECT staff_name AS name, 'Staff' AS type FROM college_staff;`,
  },
  {
    id: 37,
    category: 'Alias',
    difficulty: 'easy',
    question: 'Show department name as "Department" and building as "Location".',
    hint: 'Use column aliases with AS',
    template: 'SELECT dept_name AS Department, building AS Location FROM college_departments;',
    solution: 'SELECT dept_name AS Department, building AS Location FROM college_departments;',
  },
  {
    id: 38,
    category: 'WHERE',
    difficulty: 'hard',
    question: 'Find students enrolled in academic year "2023-24".',
    hint: 'Join college_students with college_years and filter year_name',
    template: `SELECT s.student_name, y.year_name
FROM college_students s
JOIN college_years y ON s.year_id = y.year_id
WHERE y.year_name = '2023-24';`,
    solution: `SELECT s.student_name, y.year_name
FROM college_students s
JOIN college_years y ON s.year_id = y.year_id
WHERE y.year_name = '2023-24';`,
  },
  {
    id: 39,
    category: 'Aggregate',
    difficulty: 'hard',
    question: 'Find how many courses each staff member teaches.',
    hint: 'GROUP BY staff_id from college_courses table, join college_staff for names',
    template: `SELECT st.staff_name, COUNT(c.course_id) AS course_count
FROM college_staff st
LEFT JOIN college_courses c ON st.staff_id = c.staff_id
GROUP BY st.staff_id, st.staff_name;`,
    solution: `SELECT st.staff_name, COUNT(c.course_id) AS course_count
FROM college_staff st
LEFT JOIN college_courses c ON st.staff_id = c.staff_id
GROUP BY st.staff_id, st.staff_name;`,
  },
  {
    id: 40,
    category: 'Subquery',
    difficulty: 'medium',
    question: 'Find courses that have no enrollments.',
    hint: 'WHERE course_id NOT IN (SELECT course_id FROM college_enrollments)',
    template: `SELECT course_name
FROM college_courses
WHERE course_id NOT IN (SELECT course_id FROM college_enrollments);`,
    solution: `SELECT course_name
FROM college_courses
WHERE course_id NOT IN (SELECT course_id FROM college_enrollments);`,
  },
];

let activeQuestion = null;
let activeTable = null;
let completedIds = new Set();
let messageHistory = [];

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    completedIds = new Set(saved);
  } catch {
    completedIds = new Set();
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedIds]));
}

function initDatabase() {
  alasql.options.errorlog = false;
  const statements = INIT_SQL.split(';')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    alasql(stmt);
  }
}

function updateTableCount() {
  const el = document.getElementById('tableCount');
  if (el) el.textContent = Object.keys(TABLE_SCHEMAS).length;
}

function dropPracticeTables() {
  for (const t of Object.keys(TABLE_SCHEMAS)) {
    try {
      alasql(`DROP TABLE IF EXISTS ${t}`);
    } catch {
      /* ignore */
    }
  }
}

function ensurePracticeDb() {
  SchemaPlayground.deactivate();
  dropPracticeTables();
  initDatabase();
  updateTableCount();
  renderTableList();
  renderSchema(activeTable || 'college_departments');
}

function ensurePlaygroundDb() {
  dropPracticeTables();
  SchemaPlayground.activate();
}

function resetDatabase() {
  const tables = Object.keys(TABLE_SCHEMAS);
  for (const t of tables) {
    try {
      alasql(`DROP TABLE IF EXISTS ${t}`);
    } catch {
      /* ignore */
    }
  }
  initDatabase();
  logMessage('Database reset to original state.', 'info');
  if (activeTable) showTableData(activeTable);
}

function normalizeValue(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') {
    return Number.isInteger(v) ? v : Math.round(v * 10000) / 10000;
  }
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).trim();
}

function resultToMatrix(data) {
  if (!data || !data.length) return { columns: [], rows: [] };
  const columns = Object.keys(data[0]);
  const rows = data.map((row) => columns.map((c) => normalizeValue(row[c])));
  return { columns, rows };
}

function sortMatrix(matrix) {
  return [...matrix.rows].sort((a, b) =>
    JSON.stringify(a).localeCompare(JSON.stringify(b))
  );
}

function matricesEqual(a, b) {
  const colsA = a.columns.map((c) => c.toLowerCase()).sort().join(',');
  const colsB = b.columns.map((c) => c.toLowerCase()).sort().join(',');
  if (colsA !== colsB) return false;
  const rowsA = sortMatrix(a);
  const rowsB = sortMatrix(b);
  return JSON.stringify(rowsA) === JSON.stringify(rowsB);
}

function runQuery(sql) {
  const trimmed = sql.trim();
  if (!trimmed) throw new Error('Query is empty.');
  const start = performance.now();
  const result = alasql(trimmed);
  const elapsed = Math.round(performance.now() - start);

  if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'object' && !(result[0] instanceof Date)) {
    return { type: 'select', data: result, elapsed };
  }
  if (Array.isArray(result)) {
    return { type: 'select', data: result, elapsed };
  }
  return { type: 'modify', affected: result, elapsed };
}

function renderTable(columns, rows) {
  if (!rows.length) {
    return '<p class="empty-state">No rows returned.</p>';
  }
  let html = '<table class="data-table"><thead><tr>';
  for (const col of columns) {
    html += `<th>${escapeHtml(col)}</th>`;
  }
  html += '</tr></thead><tbody>';
  for (const row of rows) {
    html += '<tr>';
    for (const cell of row) {
      const val = cell === null || cell === undefined ? 'NULL' : cell;
      html += `<td title="${escapeHtml(String(val))}">${escapeHtml(String(val))}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function displayQueryResult(result) {
  const empty = document.getElementById('emptyResult');
  const container = document.getElementById('resultContainer');
  const meta = document.getElementById('resultMeta');
  const wrap = document.getElementById('resultTableWrap');

  empty.style.display = 'none';
  container.style.display = 'block';
  switchTab('queryResult');

  if (result.type === 'select') {
    const matrix = resultToMatrix(result.data);
    meta.textContent = `${result.data.length} row(s) returned in ${result.elapsed}ms`;
    wrap.innerHTML = renderTable(matrix.columns, matrix.rows);
  } else {
    meta.textContent = `Query executed in ${result.elapsed}ms`;
    wrap.innerHTML = `<p class="message success">${result.affected} row(s) affected.</p>`;
  }
}

function logMessage(text, type = 'info') {
  messageHistory.unshift({ text, type, time: new Date().toLocaleTimeString() });
  const log = document.getElementById('messageLog');
  log.innerHTML = messageHistory
    .slice(0, 50)
    .map(
      (m) =>
        `<div class="message ${m.type}" style="margin-bottom:0.5rem;"><small>${m.time}</small><br>${escapeHtml(m.text)}</div>`
    )
    .join('');
}

function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach((p) => {
    p.classList.toggle('active', p.id === tabId);
  });
}

function showTableData(tableName) {
  activeTable = tableName;
  document.querySelectorAll('.table-list button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.table === tableName);
  });

  const data = alasql(`SELECT * FROM ${tableName}`);
  const matrix = resultToMatrix(data);
  const empty = document.querySelector('#tableData .empty-state');
  const container = document.getElementById('tableDataContainer');
  const meta = document.getElementById('tableDataMeta');
  const wrap = document.getElementById('tableDataWrap');

  empty.style.display = 'none';
  container.style.display = 'block';
  meta.textContent = `${tableName} — ${data.length} row(s)`;
  wrap.innerHTML = renderTable(matrix.columns, matrix.rows);
  renderSchema(tableName);
  switchTab('tableData');
}

function renderSchema(selectedTable) {
  const schemaView = document.getElementById('schemaView');
  const cols = TABLE_SCHEMAS[selectedTable || activeTable || 'college_departments'];
  let html = `<table class="schema-table"><thead><tr><th>Column</th><th>Type</th><th>Key</th></tr></thead><tbody>`;
  for (const col of cols) {
    const keyClass = col.key.startsWith('PK') ? 'pk' : col.key.startsWith('FK') ? 'fk' : '';
    html += `<tr><td>${col.name}</td><td>${col.type}</td><td class="${keyClass}">${col.key || '—'}</td></tr>`;
  }
  html += '</tbody></table>';
  schemaView.innerHTML = html;
}

function renderTableList() {
  const list = document.getElementById('tableList');
  list.innerHTML = Object.keys(TABLE_SCHEMAS)
    .map(
      (name) =>
        `<li><button data-table="${name}" type="button"><span class="table-icon">▸</span>${name}</button></li>`
    )
    .join('');

  list.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => showTableData(btn.dataset.table));
  });
}

function getCategories() {
  return [...new Set(PRACTICE_QUESTIONS.map((q) => q.category))];
}

function renderFilters() {
  const filters = document.getElementById('categoryFilters');
  const cats = ['All', ...getCategories()];
  filters.innerHTML = cats
    .map(
      (c) =>
        `<button class="filter-chip${c === 'All' ? ' active' : ''}" data-cat="${c}" type="button">${c}</button>`
    )
    .join('');

  filters.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      filters.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      renderQuestionList(chip.dataset.cat);
    });
  });
}

function renderQuestionList(filter = 'All') {
  const list = document.getElementById('questionList');
  const filtered =
    filter === 'All'
      ? PRACTICE_QUESTIONS
      : PRACTICE_QUESTIONS.filter((q) => q.category === filter);

  list.innerHTML = filtered
    .map((q) => {
      const done = completedIds.has(q.id) ? ' done' : '';
      const active = activeQuestion?.id === q.id ? ' active' : '';
      const diffClass = `diff-${q.difficulty}`;
      return `<div class="question-card${done}${active}" data-id="${q.id}">
        <span class="q-num">Q${q.id}</span><span class="q-cat">${q.category}</span>
        <p class="q-text">${escapeHtml(q.question)}</p>
        <div class="difficulty ${diffClass}">${q.difficulty}</div>
      </div>`;
    })
    .join('');

  list.querySelectorAll('.question-card').forEach((card) => {
    card.addEventListener('click', () => selectQuestion(Number(card.dataset.id)));
  });

  document.getElementById('totalQuestions').textContent = PRACTICE_QUESTIONS.length;
  document.getElementById('completedCount').textContent = completedIds.size;
}

function selectQuestion(id) {
  activeQuestion = PRACTICE_QUESTIONS.find((q) => q.id === id);
  document.getElementById('activeQuestion').style.display = 'block';
  document.getElementById('activeQTitle').textContent = `Question ${id} — ${activeQuestion.category}`;
  document.getElementById('activeQText').textContent = activeQuestion.question;
  document.getElementById('hintBox').classList.remove('visible');
  document.getElementById('hintBox').textContent = '';
  document.getElementById('checkResult').className = 'check-result';
  renderQuestionList(
    document.querySelector('.filter-chip.active')?.dataset.cat || 'All'
  );
}

function checkAnswer() {
  if (!activeQuestion) return;

  const editor = document.getElementById('sqlEditor');
  const userSql = editor.value.trim();
  const checkEl = document.getElementById('checkResult');

  if (!userSql) {
    checkEl.className = 'check-result visible incorrect';
    checkEl.textContent = 'Write a query first, then click Check Answer.';
    return;
  }

  try {
    let isCorrect = false;

    if (activeQuestion.validateWithSelect) {
      resetDatabase();
      runQuery(userSql);
      const verify = runQuery(activeQuestion.validateWithSelect);
      const matrix = resultToMatrix(verify.data);

      if (activeQuestion.expectedRows !== undefined) {
        isCorrect = verify.data.length === activeQuestion.expectedRows;
      } else if (activeQuestion.expectedResult) {
        const expectedRows = activeQuestion.expectedResult.map((row) =>
          row.map((cell) => normalizeValue(cell))
        );
        isCorrect = JSON.stringify(sortMatrix(matrix)) === JSON.stringify(expectedRows.sort((a, b) =>
          JSON.stringify(a).localeCompare(JSON.stringify(b))
        ));
      }
    } else {
      const userResult = runQuery(userSql);
      resetDatabase();
      const expectedResult = runQuery(activeQuestion.solution);

      if (userResult.type === 'modify' || expectedResult.type === 'modify') {
        isCorrect = userResult.type === expectedResult.type;
      } else {
        const userMatrix = resultToMatrix(userResult.data);
        const expectedMatrix = resultToMatrix(expectedResult.data);
        isCorrect = matricesEqual(userMatrix, expectedMatrix);
      }
    }

    if (isCorrect) {
      completedIds.add(activeQuestion.id);
      saveProgress();
      checkEl.className = 'check-result visible correct';
      checkEl.textContent = '✓ Correct! Great job.';
      logMessage(`Question ${activeQuestion.id} answered correctly.`, 'success');
    } else {
      checkEl.className = 'check-result visible incorrect';
      checkEl.textContent =
        'Not quite right. Compare your results with "Show Solution", or try the hint.';
      logMessage(`Question ${activeQuestion.id} — answer did not match.`, 'error');
    }

    renderQuestionList(document.querySelector('.filter-chip.active')?.dataset.cat || 'All');
    document.getElementById('completedCount').textContent = completedIds.size;

    if (activeQuestion.validateWithSelect) {
      resetDatabase();
      if (activeTable) showTableData(activeTable);
    }
  } catch (err) {
    checkEl.className = 'check-result visible incorrect';
    checkEl.textContent = `Error: ${err.message}`;
    logMessage(err.message, 'error');
  }
}

function formatSql(sql) {
  return sql
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ',\n  ')
    .replace(/\bSELECT\b/gi, 'SELECT')
    .replace(/\bFROM\b/gi, '\nFROM')
    .replace(/\bWHERE\b/gi, '\nWHERE')
    .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
    .replace(/\bHAVING\b/gi, '\nHAVING')
    .replace(/\bORDER BY\b/gi, '\nORDER BY')
    .replace(/\bLIMIT\b/gi, '\nLIMIT')
    .replace(/\bJOIN\b/gi, '\nJOIN')
    .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
    .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
    .replace(/\bUNION ALL\b/gi, '\nUNION ALL')
    .replace(/\bINSERT INTO\b/gi, 'INSERT INTO')
    .replace(/\bUPDATE\b/gi, 'UPDATE')
    .replace(/\bDELETE FROM\b/gi, 'DELETE FROM')
    .trim();
}

function executeEditorQuery() {
  const sql = document.getElementById('sqlEditor').value.trim();
  if (!sql) return;
  try {
    const result = runQuery(sql);
    displayQueryResult(result);
    logMessage(`Query executed successfully (${result.elapsed}ms).`, 'success');
  } catch (err) {
    document.getElementById('emptyResult').style.display = 'none';
    document.getElementById('resultContainer').style.display = 'block';
    document.getElementById('resultMeta').textContent = 'Error';
    document.getElementById('resultTableWrap').innerHTML = `<div class="message error">${escapeHtml(err.message)}</div>`;
    switchTab('queryResult');
    logMessage(err.message, 'error');
  }
}

function bindEvents() {
  document.getElementById('btnRun').addEventListener('click', executeEditorQuery);
  document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('sqlEditor').value = '';
  });
  document.getElementById('btnFormat').addEventListener('click', () => {
    const editor = document.getElementById('sqlEditor');
    editor.value = formatSql(editor.value);
  });
  document.getElementById('btnResetDb').addEventListener('click', () => {
    if (confirm('Reset database? This will undo INSERT/UPDATE/DELETE changes from practice.')) {
      resetDatabase();
    }
  });

  document.getElementById('sqlEditor').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeEditorQuery();
    }
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  document.getElementById('btnHint').addEventListener('click', () => {
    if (!activeQuestion) return;
    const hint = document.getElementById('hintBox');
    hint.textContent = activeQuestion.hint;
    hint.classList.add('visible');
  });

  document.getElementById('btnCheck').addEventListener('click', checkAnswer);
  document.getElementById('btnShowSolution').addEventListener('click', () => {
    if (!activeQuestion) return;
    document.getElementById('sqlEditor').value = activeQuestion.solution;
    executeEditorQuery();
  });
  document.getElementById('btnLoadTemplate').addEventListener('click', () => {
    if (!activeQuestion) return;
    document.getElementById('sqlEditor').value = activeQuestion.template;
  });
}

function init() {
  loadProgress();
  try {
    initDatabase();
    document.getElementById('loadingOverlay').classList.add('hidden');
  } catch (err) {
    document.getElementById('loadingOverlay').innerHTML =
      `<p style="color:#fca5a5;">Failed to load database: ${escapeHtml(err.message)}</p>`;
    return;
  }

  document.getElementById('erDiagram').textContent = ER_DIAGRAM;
  renderTableList();
  renderSchema('college_departments');
  renderFilters();
  renderQuestionList();
  bindEvents();
  updateTableCount();
  activeTable = 'college_departments';
}

document.addEventListener('DOMContentLoaded', init);
