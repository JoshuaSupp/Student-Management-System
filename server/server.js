const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // To handle CORS issues

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS for frontend
const bcrypt = require('bcryptjs');  // Use bcryptjs 
const jwt = require('jsonwebtoken'); // Ensure JWT is imported
require('dotenv').config();  
const jwtSecretKey = process.env.JWT_SECRET_KEY;

//Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',    // MySQL server (local)
    user: 'root',         // Your MySQL username
    password: '1234',  // Your MySQL password
    database: 'students_db'  // Your database name
});

//Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to MySQL Database!');
});

//API to add a student
// app.post('/api/add_student', (req, res) => {
//     const { student_id,first_name, email, gender, age } = req.body;

//     if (!student_id || !first_name || !email || !gender || !age) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     const sql = 'INSERT INTO student_details (student_id,first_name, email, gender, age) VALUES (?,?, ?, ?, ?)';
//     db.query(sql, [student_id,first_name, email, gender, age], (err, result) => {
//         if (err) {
//             console.error('❌ Error inserting user:', err);
//             return res.status(500).json({ message: 'Database error' });
//         }
//         res.status(201).json({ message: 'User added successfully!', userId: result.insertId });
//     });
// });

app.post('/api/add_student', (req, res) => {
  const { student_id, first_name, email, gender, age, studentcourse_id } = req.body;

  // Validate input
  if (!student_id || !first_name || !email || !gender || !age || !studentcourse_id) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  // Start a transaction
  db.beginTransaction((err) => {
      if (err) {
          console.error('❌ Error starting transaction:', err);
          return res.status(500).json({ message: 'Database error' });
      }

      // Step 1: Insert the student into student_details
      const insertStudentSql = `
          INSERT INTO students_db.student_details 
          (student_id, first_name, email, gender, age, studentcourse_id) 
          VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(insertStudentSql, [student_id, first_name, email, gender, age, studentcourse_id], (err, result) => {
          if (err) {
              console.error('❌ Error inserting student:', err);
              return db.rollback(() => {
                  res.status(500).json({ message: 'Database error while inserting student' });
              });
          }

          // Step 2: Update the student count in student_courses
          const updateCourseSql = `
              UPDATE students_db.student_courses
              SET student_count = student_count + 1
              WHERE course_id = ? AND EXISTS (
                  SELECT 1 
                  FROM students_db.student_details 
                  WHERE student_id = ? AND studentcourse_id = ?
              )
          `;
          db.query(updateCourseSql, [studentcourse_id, student_id, studentcourse_id], (err, result) => {
              if (err) {
                  console.error('❌ Error updating course count:', err);
                  return db.rollback(() => {
                      res.status(500).json({ message: 'Database error while updating course count' });
                  });
              }

              // Commit the transaction
              db.commit((err) => {
                  if (err) {
                      console.error('❌ Error committing transaction:', err);
                      return db.rollback(() => {
                          res.status(500).json({ message: 'Database error while committing transaction' });
                      });
                  }

                  // Success response
                  res.status(201).json({ message: 'Student added successfully!' });
              });
          });
      });
  });
});

//API to add a course
app.post('/api/add_course', (req, res) => {
  const { course_id, course_name } = req.body;

  if (!course_id || !course_name) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO student_courses (course_id, course_name) VALUES (?, ?)';
  db.query(sql, [course_id, course_name], (err, result) => {
      if (err) {
          console.error('❌ Error inserting course:', err);
          return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'Course added successfully!', courseId: result.insertId });
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
app.get("/api/get_student/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM student_details WHERE `id`= ?";
    db.query(sql, [id], (err, result) => {
      if (err) res.json({ message: "Server error" });
      return res.json(result);
    });
  });

//API to get all courses
app.get("/api/admin_courses", (req, res) => {
  const sql = "SELECT * FROM student_courses";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error" });
    return res.json(result);
  });
});

//API to get student count from each course
app.get("/api/student_counts", (req, res) => {
  const sql = `
      SELECT 
          c.course_name,
          COUNT(sd.student_id) AS student_count
      FROM 
          student_courses c
      LEFT JOIN 
          student_details sd ON sd.studentcourse_id = c.course_id
      GROUP BY 
          c.course_name;
  `;
  
  db.query(sql, (err, result) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Server error" });
      }
      return res.json(result);
  });
});


//API to edit student
app.post("/api/edit_user/:id", (req, res) => {
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
app.delete("/api/delete/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM student_details WHERE id=?";
    const values = [id];
    db.query(sql, values, (err, result) => {
      if (err)
        return res.json({ message: "Something unexpected has occured" + err });
      return res.json({ success: "Student updated successfully" });
    });
  });

//login with session
const secretKey = process.env.JWT_SECRET_KEY;
app.post("/api/login", (req, res) => {
  //console.log("Received body:", req.body); // Debugging

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    // Compare passwords directly (plain text comparison)
    if (password === user.password) {
      // Generate a JWT token with expiration time (e.g., 15 minutes)
      const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '15m' });

      // Send the token back to the client
      return res.json({ message: "Login successful", token });
    } else {
      return res.status(400).json({ message: "Incorrect password" });
    }
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
