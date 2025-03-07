const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // To handle CORS issues

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS for frontend
//const bcrypt = require('bcryptjs');  // Use bcryptjs 
const jwt = require('jsonwebtoken'); // Ensure JWT is imported
const secretKey = 'abcde12345';

const token = jwt.sign({
  id: 1,
  username: 'GFG'
}, secretKey, { expiresIn: '1h' });

console.log(token);

jwt.verify(token, 'abcde12345', (err, decoded) => {
  if (err) {
    console.log('Token is invalid');
  } else {
    console.log('Decoded Token:', decoded);
  }
});
//Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',    // MySQL server (local)
    user: 'root',         // Your MySQL username
    password: 'Test@1234!',  // Your MySQL password
    database: 'student_db'  // Your database name
});

//Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to MySQL Database!');
});

//API to add a user
app.post('/api/students/add', (req, res) => {
  const { student_number, first_name, email, gender, age } = req.body;

  if (!student_number || !first_name || !email || !gender || !age) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO student_details (student_number, first_name, email, gender, age) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [student_number, first_name, email, gender, age], (err, result) => {
      if (err) {
          console.error('❌ Error inserting user:', err);
          return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'User added successfully!', userId: result.insertId });
  });
});

//API to get all students
app.get("/api/students", (req, res) => {
  const sql = "SELECT * FROM student_details";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

//API to get specific student
app.get("/api/students/get/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM student_details WHERE `id`= ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

//API to edit student
app.post("/api/students/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE student_details SET `first_name`=?, `email`=?, `age`=?, `gender`=? WHERE id=?";
  const values = [
    req.body.first_name,
    req.body.email,
    req.body.age,
    req.body.gender,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Student updated successfully" });
  });
});

//API to delete student
app.delete("/api/students/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM student_details WHERE id=?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Student updated successfully" });
  });
});

//! Courses

//API to add a course
app.post('/api/courses/add', (req, res) => {
  const { course_number, name, student_count } = req.body;

  if (!course_number || !name || !student_count) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO course_details (course_number, name, student_count) VALUES (?, ?, ?)';
  db.query(sql, [course_number, name, student_count], (err, result) => {
      if (err) {
          console.error('❌ Error inserting course:', err);
          return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'Course added successfully!', userId: result.insertId });
  });
});

//API to get all courses
app.get("/api/courses", (req, res) => {
  const sql = "SELECT * FROM course_details";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

//API to get specific course
app.get("/api/courses/get/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM course_details WHERE `id`= ?";
  db.query(sql, [id], (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

//API to edit course
app.post("/api/courses/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE course_details SET `name`=?, `student_count`=? WHERE id=?";
  const values = [
    req.body.name,
    req.body.student_count,
    id,
  ];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Course updated successfully" });
  });
});

//API to delete course
app.delete("/api/courses/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM course_details WHERE id=?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Course updated successfully" });
  });
});

// API for admin login (NO SESSION)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check the admin table first
  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      const admin = result[0];

      if (password === admin.password) { // Replace with bcrypt if using hashed passwords
        const token = jwt.sign({ userId: admin.id, role_id: admin.role_id }, secretKey, { expiresIn: "15m" });
        return res.json({ message: "Admin login successful", token, role_id: admin.role_id});
      } else {
        return res.status(400).json({ message: "Incorrect password" });
      }
    }

    // If not found in admin, check the student_details table
    db.query("SELECT * FROM student_details WHERE email = ?", [email], (err, studentResult) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (studentResult.length > 0) {
        const student = studentResult[0];

        if (password === student.password) { // Use bcrypt if passwords are hashed
          const token = jwt.sign({ userId: student.id, role_id: student.role_id }, secretKey, { expiresIn: "15m" });
          return res.json({ message: "Student login successful", token, role_id: student.role_id });
        } else {
          return res.status(400).json({ message: "Incorrect password" });
        }
      }

      return res.status(400).json({ message: "User not found" });
    });
  });
});



// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
