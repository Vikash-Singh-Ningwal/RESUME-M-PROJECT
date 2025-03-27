const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// ✅ Middleware setup
app.use(cors()); // Handles CORS
app.use(bodyParser.json()); // Parses JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parses form data


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Vikash2004',  // Replace with your MySQL root password
  database: 'resume_builder'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});
db.query("SELECT * from users",(error,result)=> {
  console.log("result", result);
});

app.get('/',(req , res)=> {
  res.sendFile('/login.html',{root: __dirname });
});



// Signup route
app.post('/signup', (req, res) => {
  console.log('📨 Signup request received:', req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log(name);
    console.log(email);
    console.log(password);
    console.log("hwllo.........")
    return res.status(400).send('🚫 All fields are required.');
  }

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error('❌ Error checking existing user:', err);
      return res.status(500).send('❌ Server error.');
    }

    if (results.length > 0) {
      return res.status(409).send('🚫 Email already registered.');
    }
    console.log('🔍 Email is available:', email);
    const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) {
        console.error('❌ Signup Error:', err);
        return res.status(500).send('❌ Error signing up. user alredy exist.');
      }
      console.log('✅ New user added:', result);
      res.send('✅ Signup successful!');
    });
  });
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('🚫 Email and password are required.');
  }

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('❌ Login Error:', err);
      return res.status(500).send('❌ Server error during login.');
    }

    if (results.length > 0) {
      console.log('✅ Login successful for:', email);
      res.send('✅ Login successful!');
    } else {
      console.log('🚫 Invalid credentials for:', email);
      res.status(401).send('🚫 Invalid email or password.');
    }
  });
});


app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

