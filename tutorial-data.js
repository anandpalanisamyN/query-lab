/* SQL Tutorial — structured learning path */

const TUTORIAL_PATH = [
  {
    id: 'concepts',
    step: 1,
    title: 'Core Concepts',
    icon: '📚',
    summary: 'Understand databases, tables, rows, columns, and keys before writing SQL.',
    lessons: [
      {
        id: 'what-is-sql',
        title: 'What is SQL?',
        sections: [
          {
            heading: 'Structured Query Language',
            body: `<p><strong>SQL</strong> is the standard language for talking to relational databases. You use it to:</p>
            <ul>
              <li><strong>Read</strong> data — <code>SELECT</code></li>
              <li><strong>Insert</strong> new rows — <code>INSERT</code></li>
              <li><strong>Update</strong> existing rows — <code>UPDATE</code></li>
              <li><strong>Delete</strong> rows — <code>DELETE</code></li>
              <li><strong>Define structure</strong> — <code>CREATE TABLE</code></li>
            </ul>
            <p>Think of SQL as instructions you send to the database. The database executes them and returns results.</p>`,
          },
        ],
      },
      {
        id: 'tables-rows-columns',
        title: 'Tables, Rows & Columns',
        sections: [
          {
            heading: 'How data is organized',
            body: `<p>A <strong>table</strong> is like a spreadsheet:</p>
            <ul>
              <li><strong>Columns</strong> define what kind of data is stored (name, age, GPA…)</li>
              <li><strong>Rows</strong> are individual records — one student, one course, etc.</li>
              <li>Each column has a <strong>data type</strong>: <code>INT</code>, <code>VARCHAR</code>, <code>DATE</code>, …</li>
            </ul>
            <div class="tut-diagram">college_students
┌────────────┬───────────────┬─────────┐
│ student_id │ student_name  │   gpa   │  ← columns
├────────────┼───────────────┼─────────┤
│    101     │ John Smith    │  3.45   │  ← row
│    102     │ Sarah Johnson │  3.80   │  ← row
└────────────┴───────────────┴─────────┘</div>`,
          },
        ],
      },
      {
        id: 'primary-foreign-keys',
        title: 'Primary & Foreign Keys',
        sections: [
          {
            heading: 'Primary Key (PK)',
            body: `<p>A <strong>primary key</strong> uniquely identifies each row. No two rows can share the same PK value.</p>
            <p>Example: <code>student_id</code> in <code>college_students</code>.</p>`,
          },
          {
            heading: 'Foreign Key (FK)',
            body: `<p>A <strong>foreign key</strong> links rows in one table to rows in another. It references a primary key in the related table.</p>
            <p>Example: <code>dept_id</code> in <code>college_students</code> points to <code>dept_id</code> in <code>college_departments</code>.</p>
            <div class="tut-diagram">college_departments          college_students
  dept_id (PK) ──────────────► dept_id (FK)
  dept_name                     student_name</div>`,
          },
        ],
      },
      {
        id: 'college-database',
        title: 'Our College Database',
        sections: [
          {
            heading: '8 connected tables',
            body: `<p>This lab uses a college database with departments, staff, students, courses, enrollments, exams, and results.</p>
            <p>Table names follow the pattern <code>college_*</code> (plural): <code>college_departments</code>, <code>college_students</code>, <code>college_exam_results</code>, etc.</p>
            <p>In the next modules you'll query this database hands-on.</p>`,
          },
        ],
        showSchema: true,
      },
    ],
  },
  {
    id: 'query-types',
    step: 2,
    title: 'Query Types',
    icon: '🔍',
    summary: 'Learn each SQL query type with examples you can run live.',
    lessons: [
      {
        id: 'select-basics',
        title: 'SELECT — Read Data',
        sections: [
          {
            heading: 'Retrieve columns from a table',
            body: `<p><code>SELECT</code> reads data. Pick specific columns or use <code>*</code> for all columns.</p>`,
          },
        ],
        exampleSql: 'SELECT student_name, gpa FROM college_students;',
        tryIt: true,
        challenge: {
          prompt: 'Select all columns from college_departments.',
          template: 'SELECT * FROM college_departments;',
          solution: 'SELECT * FROM college_departments;',
        },
      },
      {
        id: 'where-filter',
        title: 'WHERE — Filter Rows',
        sections: [
          {
            heading: 'Filter with conditions',
            body: `<p><code>WHERE</code> keeps only rows that match a condition. Use operators like <code>=</code>, <code>&gt;</code>, <code>BETWEEN</code>, and <code>LIKE</code>.</p>`,
          },
        ],
        exampleSql: 'SELECT student_name, gpa FROM college_students WHERE gpa > 3.5;',
        tryIt: true,
        challenge: {
          prompt: 'Find students with GPA greater than 3.5.',
          template: 'SELECT student_name, gpa FROM college_students WHERE gpa > 3.5;',
          solution: 'SELECT student_name, gpa FROM college_students WHERE gpa > 3.5;',
        },
      },
      {
        id: 'order-by',
        title: 'ORDER BY — Sort Results',
        sections: [
          {
            heading: 'Sort ascending or descending',
            body: `<p><code>ORDER BY column ASC</code> sorts lowest-first. <code>DESC</code> sorts highest-first. Combine with <code>LIMIT</code> to get top N rows.</p>`,
          },
        ],
        exampleSql: 'SELECT student_name, gpa FROM college_students ORDER BY gpa DESC LIMIT 3;',
        tryIt: true,
        challenge: {
          prompt: 'List students ordered by GPA descending.',
          template: 'SELECT student_name, gpa FROM college_students ORDER BY gpa DESC;',
          solution: 'SELECT student_name, gpa FROM college_students ORDER BY gpa DESC;',
        },
      },
      {
        id: 'aggregates',
        title: 'Aggregates — COUNT, AVG, SUM',
        sections: [
          {
            heading: 'Summarize data',
            body: `<p>Aggregate functions compute values across rows:</p>
            <ul>
              <li><code>COUNT(*)</code> — number of rows</li>
              <li><code>AVG(column)</code> — average</li>
              <li><code>SUM(column)</code> — total</li>
              <li><code>MAX</code> / <code>MIN</code> — highest / lowest</li>
            </ul>
            <p>Use <code>GROUP BY</code> to aggregate per group (e.g. per department).</p>`,
          },
        ],
        exampleSql: 'SELECT dept_id, COUNT(*) AS student_count FROM college_students GROUP BY dept_id;',
        tryIt: true,
        challenge: {
          prompt: 'Count the total number of students.',
          template: 'SELECT COUNT(*) AS total FROM college_students;',
          solution: 'SELECT COUNT(*) AS total FROM college_students;',
        },
      },
      {
        id: 'joins',
        title: 'JOIN — Combine Tables',
        sections: [
          {
            heading: 'Link related tables',
            body: `<p><code>JOIN</code> combines rows from two tables using a related column (usually a foreign key).</p>
            <ul>
              <li><code>INNER JOIN</code> — only matching rows from both tables</li>
              <li><code>LEFT JOIN</code> — all rows from left table, matches from right (or NULL)</li>
            </ul>`,
          },
        ],
        exampleSql: `SELECT s.student_name, d.dept_name
FROM college_students s
INNER JOIN college_departments d ON s.dept_id = d.dept_id;`,
        tryIt: true,
        challenge: {
          prompt: 'Show student names with their department names.',
          template: `SELECT s.student_name, d.dept_name
FROM college_students s
INNER JOIN college_departments d ON s.dept_id = d.dept_id;`,
          solution: `SELECT s.student_name, d.dept_name
FROM college_students s
INNER JOIN college_departments d ON s.dept_id = d.dept_id;`,
        },
      },
      {
        id: 'insert-update-delete',
        title: 'INSERT, UPDATE, DELETE',
        sections: [
          {
            heading: 'Modify data',
            body: `<ul>
              <li><code>INSERT INTO table VALUES (...)</code> — add a row</li>
              <li><code>UPDATE table SET col = val WHERE ...</code> — change rows</li>
              <li><code>DELETE FROM table WHERE ...</code> — remove rows</li>
            </ul>
            <p>Always use <code>WHERE</code> with UPDATE and DELETE unless you mean to affect every row!</p>`,
          },
        ],
        exampleSql: "SELECT student_name, gpa FROM college_students WHERE student_id = 103;",
        tryIt: true,
        note: 'Modification queries change the database. Use Reset DB in Practice Lab if needed.',
      },
    ],
  },
  {
    id: 'ddl',
    step: 3,
    title: 'Create Tables & Insert',
    icon: '🏗️',
    summary: 'Build your own tables, set foreign keys, and insert data.',
    lessons: [
      {
        id: 'create-table',
        title: 'CREATE TABLE',
        sections: [
          {
            heading: 'Define a new table',
            body: `<p><code>CREATE TABLE</code> defines column names and types. Mark one column as <code>PRIMARY KEY</code>.</p>`,
          },
        ],
        exampleSql: `CREATE TABLE college_departments (
  dept_id INT PRIMARY KEY,
  dept_name VARCHAR(50),
  building VARCHAR(50)
);`,
        tryIt: false,
        playgroundHint: true,
      },
      {
        id: 'insert-values',
        title: 'INSERT Values',
        sections: [
          {
            heading: 'Add rows to a table',
            body: `<p>After creating a table, use <code>INSERT INTO</code> to add data. Values must match column order and types.</p>`,
          },
        ],
        exampleSql: `INSERT INTO college_departments VALUES (1, 'Computer Science', 'Block A');
SELECT * FROM college_departments;`,
        tryIt: true,
        challenge: {
          prompt: 'Select all rows from college_departments to see seeded data.',
          template: 'SELECT * FROM college_departments;',
          solution: 'SELECT * FROM college_departments;',
        },
      },
      {
        id: 'foreign-keys-ddl',
        title: 'Foreign Keys in Design',
        sections: [
          {
            heading: 'Link tables when designing',
            body: `<p>When designing schemas, add a column that references another table's primary key. Create the <strong>referenced table first</strong>, then the table with the FK.</p>
            <p>Use the <strong>Schema Playground</strong> (Step 5) to build tables visually with FK dropdowns.</p>`,
          },
        ],
        exampleSql: `CREATE TABLE college_students (
  student_id INT PRIMARY KEY,
  student_name VARCHAR(80),
  dept_id INT
);`,
        tryIt: false,
        playgroundHint: true,
      },
    ],
  },
  {
    id: 'practice',
    step: 4,
    title: 'Practice Session',
    icon: '✏️',
    summary: '40 guided questions on the college database with hints and answer checking.',
    view: 'practice',
  },
  {
    id: 'playground',
    step: 5,
    title: 'Build Your Schema',
    icon: '🧪',
    summary: 'Create tables from scratch, set foreign keys, and run your own SQL.',
    view: 'playground',
  },
  {
    id: 'free-practice',
    step: 6,
    title: 'Free Practice',
    icon: '🚀',
    summary: 'Open SQL editor — experiment freely on the college database.',
    view: 'practice',
    freeMode: true,
  },
];
