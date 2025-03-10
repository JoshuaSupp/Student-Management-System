const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // To handle CORS issues

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS for frontend
const bcrypt = require('bcryptjs');  // Use bcryptjs 
const jwt = require('jsonwebtoken'); // Ensure JWT is imported
const fs = require("fs");
const moment = require("moment-timezone"); 
const { google } = require("googleapis");
require('dotenv').config();  
const jwtSecretKey = process.env.JWT_SECRET_KEY;


//Google meet auth
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

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

// API Endpoint: Create Google Meet

const convertToLocalTime = (dateTime, timezone) => {
  // Ensure moment understands the format (could be UTC or any other format)
  const localTime = moment(dateTime).tz(timezone, true); // Pass 'true' to keep the date in the correct format
  return localTime.format("YYYY-MM-DDTHH:mm:ss"); // Format for the Google Calendar API (ISO 8601 format)
};

app.post("/api/create_meet", async (req, res) => {
  const { title, start, end, course_id } = req.body;

  try {
    // Log the raw incoming start and end times
    // console.log("Raw Start Time:", start);
    // console.log("Raw End Time:", end);

    // Convert start and end times to UTC before creating Google Calendar event
    const startUtc = moment(start).tz("UTC").format(); // Google Calendar expects UTC time
    const endUtc = moment(end).tz("UTC").format();

    // Log the converted times
    // console.log("Converted Start (UTC):", startUtc);
    // console.log("Converted End (UTC):", endUtc);

    const event = {
      summary: title || "Google Meet Meeting",
      description: "Join via Google Meet",
      start: { dateTime: startUtc, timeZone: "Asia/Kuala_Lumpur" },
      end: { dateTime: endUtc, timeZone: "Asia/Kuala_Lumpur" },
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(2, 15),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    // Create event on Google Calendar
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1, // Required for Google Meet
    });

    // Extract the Google Meet link from the response
    const meetLink =
      response.data.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === "video"
      )?.uri;

    // Convert start and end times to local time before saving to DB
    const formattedStart = convertToLocalTime(start, "Asia/Kuala_Lumpur");
    const formattedEnd = convertToLocalTime(end, "Asia/Kuala_Lumpur");

    // Log the formatted times to verify conversion
    // console.log("Formatted Start Time for DB:", formattedStart);
    // console.log("Formatted End Time for DB:", formattedEnd);

    const url = meetLink;
    // Save the meeting to the MySQL database in local time
    const query = `
      INSERT INTO admin_meetings (title, start, end, url, course_id)
      VALUES (?, ?, ?, ?,?)
    `;

    db.query(query, [title, formattedStart, formattedEnd, url, course_id], (err, result) => {
      if (err) {
        console.error("❌ Error saving meeting to DB:", err);
        return res.status(500).json({ error: "Failed to save meeting to database" });
      }

      // Respond with the created meeting's Google Meet link
      res.json({ url });
    });
  } catch (error) {
    console.error("❌ Error creating Google Meet:", error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
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

app.post("/api/mark_attendance", (req, res) => {
  //console.log("Received request body:", req.body);
  const { student_id, course_id, joineddate_time, class_date, present_absent } = req.body;


  if (!student_id || !course_id || !joineddate_time || !class_date || !present_absent) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const formattedjoineddate_time = convertToLocalTime(joineddate_time, "Asia/Kuala_Lumpur");
  const formattedclassdate_time = convertToLocalTime(class_date, "Asia/Kuala_Lumpur");

  const query = `
    INSERT INTO student_attendance (student_id, course_id, joineddate_time, class_date, present_absent)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [student_id, course_id, formattedjoineddate_time, formattedclassdate_time, present_absent], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to mark attendance" });
    }
    res.json({ message: "Attendance marked successfully" });
  });
});



// ✅ API: Get All Meetings
app.get("/api/meetings", (req, res) => {
  db.query(
    `SELECT m.id, m.title, 
      DATE_FORMAT(m.start, '%Y-%m-%d %H:%i:%s') AS start, 
      DATE_FORMAT(m.end, '%Y-%m-%d %H:%i:%s') AS end, 
      m.url, 
      m.course_id,
      c.course_name 
     FROM admin_meetings m
     LEFT JOIN student_courses c ON m.course_id = c.course_id`,  
    (err, results) => {
      if (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ error: "Database Error", details: err });
      }
      res.json(results); // Return meetings with course_name
    }
  );
});


// ✅ API: to get meeting details by ID
app.get("/api/each_meeting/:id", (req, res) => {
  const { id } = req.params;

  // SQL query to fetch the meeting details by ID
  const query = "SELECT * FROM admin_meetings WHERE id = ?";

  // Execute the query
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching meeting:", err);
      return res.status(500).json({ error: "An error occurred while fetching the meeting." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Meeting not found." });
    }

    // Return the fetched meeting data
    return res.status(200).json(results[0]);
  });
});


// ✅ API: Delete Meeting
app.delete("/api/delete_meeting/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM admin_meetings WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database Error", details: err });
    }
    res.json({ message: "Meeting deleted" });
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

  //API to get specific course
app.get("/api/get_course/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM student_courses WHERE `id`= ?";
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
      "UPDATE student_details SET `first_name`=?, `email`=?, `age`=?, `gender`=?, `studentcourse_id`=? WHERE id=?";
    const values = [
      req.body.first_name,
      req.body.email,
      req.body.age, 
      req.body.gender,
      req.body.studentcourse_id,
      id,
    ];
    db.query(sql, values, (err, result) => {
      if (err)
        return res.json({ message: "Something unexpected has occured" + err });
      return res.json({ success: "Student updated successfully" });
    });
  });

//API to edit student
app.post("/api/edit_course/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE student_courses SET `course_name`=? WHERE id=?";
  const values = [
    req.body.course_name,
    id,
  ];
 // console.log('Course Name',req.body.course_name);
 // console.log('Student Count',req.body.student_count);
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Course updated successfully" });
  });
});

//API to edit meetings
app.put('/api/edit_meetings/:id', (req, res) => {
  const meetingId = req.params.id;
  let { title, start, end, course_id } = req.body;

  if (!title || !start || !end) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // ✅ Extract raw datetime without conversion
  const formatDateForMySQL = (isoString) => {
    if (!isoString) return null;
    return isoString.replace("T", " "); // Convert 'YYYY-MM-DDTHH:MM' to 'YYYY-MM-DD HH:MM:SS'
  };

  start = formatDateForMySQL(start);
  end = formatDateForMySQL(end);

  const sql = "UPDATE admin_meetings SET title = ?, start = ?, end = ?, course_id = ? WHERE id = ?";

  db.query(sql, [title, start, end, course_id, meetingId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database update failed" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    res.json({ message: "Meeting updated successfully" });
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

//API to delete student
app.delete("/api/course_delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM student_courses WHERE id=?";
  const values = [id];
  db.query(sql, values, (err, result) => {
    if (err)
      return res.json({ message: "Something unexpected has occured" + err });
    return res.json({ success: "Course updated successfully" });
  });
});

//login with session
const secretKey = process.env.JWT_SECRET_KEY;

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
        return res.json({ message: "Admin login successful", token, role_id: admin.role_id });
      } else {
        return res.status(400).json({ message: "Incorrect password" });
      }
    }

    // If not found in admin, check the student_details table
    db.query("SELECT id, student_id, role_id, studentcourse_id, password FROM student_details WHERE email = ?", [email], (err, studentResult) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (studentResult.length > 0) {
        const student = studentResult[0];

        if (password === student.password) { // Use bcrypt if passwords are hashed
          const token = jwt.sign(
            { userId: student.id,student_id: student.student_id, role_id: student.role_id, studentcourse_id: student.studentcourse_id }, 
            secretKey, 
            { expiresIn: "15m" }
          );

          return res.json({ 
            message: "Student login successful", 
            token, 
            role_id: student.role_id, 
            studentcourse_id: student.studentcourse_id,
            student_id: student.student_id
          });
        } else {
          return res.status(400).json({ message: "Incorrect password" });
        }
      }
      return res.status(400).json({ message: "User not found" });
    });
  });
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
