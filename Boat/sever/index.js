const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config(); // To use environment variables

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
});

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Boat Booking API',
      version: '1.0.0',
      description: 'API for managing boat ticket bookings',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Local server'
      }
    ]
  },
  apis: ['index.js'], // Assuming your file is named 'index.js'
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /getTicketboat:
 *   get:
 *     summary: Get all ticket boat records
 *     responses:
 *       200:
 *         description: Successful response
 */
app.get('/getTicketboat',(req, res) => {
  db.query('SELECT * FROM ticketboat ORDER BY creat_date DESC', (err, result) => {
    if(err) throw err;
    res.send(result);
  })
})

/**
 * @swagger
 * /getCount:
 *   get:
 *     summary: Get total count of adults, children, and people for a given date and time
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Date and time for count query
 *         schema:
 *           type: object
 *           required:
 *             - date
 *             - time
 *           properties:
 *             date:
 *               type: string
 *             time:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful response
 */
app.get('/getCount/:date/:time', (req, res) => {
  const { date, time } = req.params;

  // Define the SQL query to get the ticket counts
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

  // Execute the SQL query
  db.query(query, [date, time], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    } else {
      if (results.length > 0) {
        const result = results[0];
        res.json({
          date: result.date,
          time: result.time,
          total_adults: result.total_adults,
          total_children: result.total_children,
          total_people: result.total_people
        });
      } else {
        res.json({});
      }
    }
  });
});


/**
 * @swagger
 * /addTicketboat:
 *   post:
 *     summary: Add a new ticket boat record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               adults:
 *                 type: integer
 *               children:
 *                 type: integer
 *               total_people:
 *                 type: integer
 *               total_price:
 *                 type: number
 *               customer_name:
 *                 type: string
 *               email:
 *                 type: string
 *               tel:
 *                 type: string
 *     responses:
 *       201:
 *         description: Record added successfully
 */
app.post('/addTicketboat', (req, res) => {
  const { id, date, time, adults, children, total_people, total_price, customer_name, email, tel,creat_date } = req.body;
  const status = "รอชำระเงิน"
  const sql = `
    INSERT INTO ticketboat (id, date, time, adults, children, total_people, total_price, customer_name, email, tel, status,creat_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;
  db.query(sql, [id, date, time, adults, children, total_people, total_price, customer_name, email, tel, status,creat_date], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.status(201).json({ message: 'Record added successfully', id: result.insertId });
  });
});


/**
 * @swagger
 * /send-email:
 *   post:
 *     summary: Send an email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: "poochit.sk@gmail.com",
    pass: "xvhofxlslhyajajm"
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
