const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config(); // To use environment variables

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: "boatbooking"
})


app.get('/getTicketboat',(req, res) => {
  db.query('SELECT * FROM ticketboat', (err, result) => {
    if(err) throw err;
    res.send(result);
  })
})

app.get('/getCount', (req, res) => {
  const { date, time } = req.body; 

  const query = `
    SELECT 
      date, 
      time, 
      SUM(adults) AS total_adults, 
      SUM(children) AS total_children, 
      SUM(adults + children) AS total_people 
    FROM 
      ticketboat 
    WHERE 
      date = ? AND time = ? 
    GROUP BY 
      date, time;
  `;

  db.query(query, [date, time], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server Error');
    } else {
      res.json(result);
    }
  });
});


app.post('/addTicketboat', (req, res) => {
  const { date, time, adults, children, total_people, total_price, customer_name, email } = req.body;

  const sql = `
    INSERT INTO ticketboat (date, time, adults, children, total_people, total_price, customer_name, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [date, time, adults, children, total_people, total_price, customer_name, email], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.status(201).json({ message: 'Record added successfully', id: result.insertId });
  });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});

app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;


  if (!to || !subject || !text) {
    console.error(req.body);
    return res.status(400).send('Missing required fields');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: to,                      
    subject: subject,            
    text: text                   
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error: ', error);
      return res.status(500).send('Failed to send email');
    } 
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
