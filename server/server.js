const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // To handle CORS issues
const cron = require("node-cron"); //cron 
const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS for frontend
const bcrypt = require('bcryptjs');  // Use bcryptjs 
const jwt = require('jsonwebtoken'); // Ensure JWT is imported
const fs = require("fs");
const moment = require("moment-timezone"); 
const { google } = require("googleapis");
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
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

const uploadPath = path.join(__dirname, 'uploads');
// Check if folder exists and create it if it doesn't
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('Profile pictures folder created');
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save file with a timestamp as name
  },
});

const upload = multer({ storage });

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

//API to create a meet
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

//API to create student
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

function sendPasswordEmail(toEmail, password) {
  const mailOptions = {
    from: 'joshuasupp@gmail.com',
    to: toEmail,
    subject: 'Your Student Login Credentials',
    text: `Hello Welcome to Devxl Institue!!,\nYour student account has been created.\nYour Email is: ${toEmail} \nYour temporary password is: ${password}\n\nThank you!`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

app.post('/api/add_student', async (req, res) => {
  const { student_id, first_name, email, age, gender, studentcourse_id } = req.body;

  if (!student_id || !first_name || !email || !age || !gender || !studentcourse_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Generate a 4-character random password
  const generatePassword = () => Math.random().toString(36).slice(-4);
  const plainPassword = generatePassword(); // Example: "x7y9"

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const role_id = "002";

    const insertQuery = `
      INSERT INTO student_details (student_id, first_name, email, age, gender, studentcourse_id, role_id, password) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [student_id, first_name, email, age, gender, studentcourse_id, role_id, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting student:', err);
        return res.status(500).json({ error: 'Failed to add student' });
      }

      // ✅ Send the password via email
      sendPasswordEmail(email, plainPassword);

      res.json({ message: 'Student added successfully. Check email for login credentials.' });
    });

  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Server error while hashing password' });
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

//API to mark attendance
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


// 📌 CRON Job to mark absences for missed classes
cron.schedule("*/1 * * * *", () => {
  console.log("Running attendance check...");

  // Get all past meetings that have ended
  db.query("SELECT * FROM admin_meetings WHERE end < NOW()", (err, meetings) => {
    if (err) {
      console.error("Error fetching meetings:", err);
      return;
    }

    meetings.forEach((meeting) => {
      const { id, start, course_id } = meeting;

      // Get students who attended this class
      db.query(
        "SELECT student_id FROM student_attendance WHERE class_date = ? AND course_id = ?",
        [start, course_id],
        (err, attendedStudents) => {
          if (err) {
            console.error("Error fetching attendance records:", err);
            return;
          }

          // Get all students enrolled in the course
          db.query(
            "SELECT student_id FROM student_details WHERE studentcourse_id = ?",
            [course_id],
            (err, allStudents) => {
              if (err) {
                console.error("Error fetching enrolled students:", err);
                return;
              }

              // Find students who DID NOT attend
              const attendedSet = new Set(attendedStudents.map((s) => s.student_id));
              const absentStudents = allStudents.filter((s) => !attendedSet.has(s.student_id));

              if (absentStudents.length === 0) {
                console.log(`No absentees for course ${course_id}`);
                return;
              }

              // Convert class date to local format
              const formattedClassDate = convertToLocalTime(start, "Asia/Kuala_Lumpur");
              let checkedCount = 0;
              const absentValues = [];

              absentStudents.forEach((s) => {
                db.query(
                  "SELECT student_id FROM student_details WHERE student_id = ?",
                  [s.student_id],
                  (err, result) => {
                    if (err) {
                      console.error("Error checking student existence:", err);
                      return;
                    }

                    if (result.length > 0) {
                      // Check if attendance already exists
                      db.query(
                        "SELECT * FROM student_attendance WHERE student_id = ? AND class_date = ? AND course_id = ?",
                        [s.student_id, formattedClassDate, course_id],
                        (err, existingRecord) => {
                          if (err) {
                            console.error("Error checking duplicate attendance:", err);
                            return;
                          }

                          if (existingRecord.length === 0) {
                            absentValues.push(
                              `('${s.student_id}', '${course_id}', NULL, '${formattedClassDate}', 'Absent')`
                            );
                          } else {
                            console.log(
                              `Skipping student ID ${s.student_id} - already marked absent.`
                            );
                          }

                          checkedCount++;
                          if (checkedCount === absentStudents.length && absentValues.length > 0) {
                            // Execute the insert only after all checks are completed
                            const query = `
                              INSERT INTO student_attendance (student_id, course_id, joineddate_time, class_date, present_absent)
                              VALUES ${absentValues.join(",")}
                            `;

                            db.query(query, (err) => {
                              if (err) {
                                console.error("Error inserting absent students:", err);
                              } else {
                                console.log(
                                  `Marked ${absentValues.length} students as absent for course ${course_id}`
                                );
                              }
                            });
                          }
                        }
                      );
                    } else {
                      console.log(`Skipping student ID ${s.student_id} - does not exist.`);
                      checkedCount++;
                    }
                  }
                );
              });
            }
          );
        }
      );
    });
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
 
//API to get specific student from if
app.get("/api/get_student/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM student_details WHERE `id`= ?";
    db.query(sql, [id], (err, result) => {
      if (err) res.json({ message: "Server error" });
      return res.json(result);
    });
  });

//API to get specific student from student id
app.get("/api/getstudent_studentid/:student_id", (req, res) => {
  const student_id = req.params.student_id;
  const sql = "SELECT * FROM student_details WHERE `student_id`= ?";
  db.query(sql, [student_id], (err, result) => {
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

//API to get attendance
app.get("/api/student_attendance", (req, res) => {
  const sql = `
    SELECT 
    sa.id, 
    sa.student_id,
    sa.course_id,
    DATE_FORMAT(sa.joineddate_time, '%Y-%m-%d %H:%i:%s') AS joineddate_time, 
    DATE_FORMAT(sa.class_date, '%Y-%m-%d %H:%i:%s') AS class_date, 
    sa.present_absent,
    am.title AS lecture_title  
  FROM student_attendance sa
  LEFT JOIN admin_meetings am 
    ON sa.course_id = am.course_id 
    AND sa.class_date = am.start
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database Error", details: err });
    }
    res.json(results);
  });
});

//API to get attendance data for student pie chart
app.get("/api/student_attendance/:student_id", (req, res) => {
  const { student_id } = req.params;

  const query = `
                SELECT sa.student_id, sa.class_date, sa.present_absent, sa.joineddate_time
                FROM student_attendance sa
                JOIN (
                    SELECT student_id, class_date, 
                          MAX(joineddate_time) AS latest_joined
                    FROM student_attendance
                    WHERE student_id = ?
                    GROUP BY student_id, class_date
                ) latest 
                ON sa.student_id = latest.student_id 
                AND sa.class_date = latest.class_date 
                AND (
                    sa.joineddate_time = latest.latest_joined 
                    OR (latest.latest_joined IS NULL AND sa.joineddate_time IS NULL)
                )
                ORDER BY sa.class_date DESC;
                `;

  db.query(query, [student_id], (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ error: "Database Error", details: err });
    }

    const totalClasses = results.length;
    const attendedClasses = results.filter((row) => row.present_absent === "Present").length;
    const missedClasses = totalClasses - attendedClasses;

    const attendanceData = [
      { name: "Present", value: attendedClasses },
      { name: "Absent", value: missedClasses },
    ];

    res.json({ totalClasses, attendedClasses, missedClasses, attendanceData });
  });
});

//API to get profile pic
app.get('/api/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);
  res.sendFile(filepath);
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

// Image upload route
app.post('/api/uploadProfilePic/:studentId', upload.single('profile_pic'), (req, res) => {
  const { studentId } = req.params;
  const imageUrl = `/uploads/${req.file.filename}`;

  // Save the file path to the student table in the database
  const query = `UPDATE student_details SET profile_pic = ? WHERE student_id = ?`;
  db.query(query, [imageUrl, studentId], (err, result) => {
    if (err) {
      console.error('Error saving profile picture:', err);
      return res.status(500).send('Error uploading image');
    }

    return res.status(200).json({ message: 'Profile picture uploaded successfully', imageUrl });
  });
});

// Serve the uploaded images (make sure the 'uploads' folder is publicly accessible)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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
app.delete("/api/delete/:student_id", (req, res) => {
  const student_id = req.params.student_id;
  //console.log("Delete id",student_id)
  // First, delete the student's attendance records
  db.query("DELETE FROM student_attendance WHERE student_id = ?", [student_id], (err, result) => {
      if (err) {
          console.error("Error deleting attendance records:", err);
          return res.status(500).json({ message: "Error deleting attendance records" });
      }

      // Then, delete the student from student_details
      db.query("DELETE FROM student_details WHERE student_id = ?", [student_id], (err, result) => {
          if (err) {
              console.error("Error deleting student:", err);
              return res.status(500).json({ message: "Error deleting student" });
          }
          return res.json({ success: "Student deleted successfully" });
      });
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

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user is an Admin
    db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, adminResult) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (adminResult.length > 0) {
        const admin = adminResult[0];

        // Check if password is hashed
        const isHashMatch = await bcrypt.compare(password, admin.password);
        const isPlainMatch = password === admin.password; // Check if stored password is plain text

        if (!isHashMatch && !isPlainMatch) {
          return res.status(400).json({ message: "Incorrect password" });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: admin.id, role_id: admin.role_id },
          secretKey,
          { expiresIn: "15m" }
        );

        return res.json({ message: "Admin login successful", token, role_id: admin.role_id });
      }

      // If not admin, check student_details
      db.query("SELECT id, student_id, role_id, studentcourse_id, password FROM student_details WHERE email = ?", 
      [email], 
      async (err, studentResult) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (studentResult.length > 0) {
          const student = studentResult[0];

          // Check if password is hashed
          const isHashMatch = await bcrypt.compare(password, student.password);
          const isPlainMatch = password === student.password; // Check if stored password is plain text

          if (!isHashMatch && !isPlainMatch) {
            return res.status(400).json({ message: "Incorrect password" });
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: student.id, student_id: student.student_id, role_id: student.role_id, studentcourse_id: student.studentcourse_id },
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
        }

        return res.status(400).json({ message: "User not found" });
      });
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
