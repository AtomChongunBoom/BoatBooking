const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
const { format } = require('date-fns');
const handlebars = require('handlebars');
require('dotenv').config(); // To use environment variables

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const omise = require('omise')({
  secretKey: process.env.OMISE_SECRET_KEY,
  omiseVersion: process.env.OMISE_VERSION
});

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
app.get('/getTicketboat', (req, res) => {
  db.query('SELECT * FROM ticketboat ORDER BY creat_date DESC', (err, result) => {
    if (err) throw err;
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
  const { id, date, time, adults, children, total_people, total_price, first_name, last_name, email, tel, address, creat_date } = req.body;
  const status = "รอชำระเงิน"
  const sql = `
    INSERT INTO ticketboat (id, date, time, adults, children, total_people, total_price, first_name, last_name,email, tel, address,status,creat_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)
  `;
  db.query(sql, [id, date, time, adults, children, total_people, total_price, first_name, last_name, email, tel, address, status, creat_date], (err, result) => {
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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', (req, res) => {
  let { id, date, time, adults, children, total_people, total_price, first_name, last_name, email, tel, address, creat_date } = req.body;
  const adultTotal = adults * 1500;
  const childrenTotal = children * 1000;
  const vat = 7
  const totalVat = (total_price * vat / 100)
  total_price = total_price + totalVat;
  date = format(new Date(date), 'dd/MM/yyyy');
  const emailData = {
    id, date, time, adults, children, total_people,
    first_name, last_name, email, tel, address,
    adultTotal, childrenTotal, totalVat, total_price
  };

  if (!email) {
    console.error('Email is required but not provided:', req.body);
    return res.status(400).send('Missing required fields');
  }

  const htmlTemplate = fs.readFileSync('email.html', 'utf8');
  const template = handlebars.compile(htmlTemplate);
  const htmlToSend = template(emailData);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "E-Ticket สำหรับการเดินทางเรือของคุณ - [True Lesing / Ayutaya]",
    html: htmlToSend
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error while sending email: ', error);
      return res.status(500).send('Failed to send email');
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

const createCharge = (source, amount, ticketId) => {
  console.log('Creating charge', source)
  return new Promise((resolve, reject) => {
    omise.charges.create({
      amount: (amount * 100),
      currency: 'THB',
      return_uri: `http://localhost:3000/payment/success`,
      metadata: {
        ticketId
      },
      source,
    }, (err, resp) => {
      if (err) {
        return reject(err)
      }
      resolve(resp)
    })
  })
}

app.post('/payment', async (req, res) => {
  try {
    const { source: sourceId, ticketId, amount } = req.body;

    const omiseRes = await createCharge(sourceId, amount, ticketId);
    // console.log(omiseRes);

    const data = {
      ticketId,
      omiseId: omiseRes.id,
      status: omiseRes.status,
      amount: omiseRes.amount / 100,
      redirectUrl: omiseRes.authorize_uri,
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

});
