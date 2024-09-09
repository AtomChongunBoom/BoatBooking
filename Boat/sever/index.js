const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
const { format } = require('date-fns');
const handlebars = require('handlebars');
const bcrypt = require('bcrypt');
require('dotenv').config(); // To use environment variables
const path = require('path');

const jwt = require('jsonwebtoken');
const secret = 'secretLogin';

const QRCode = require('qrcode');

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
  host: process.env.host,
  user: process.env.user,
  database: process.env.database
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
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header is required');
  }

  db.query('SELECT * FROM ticketboat ORDER BY creat_date DESC', (err, result) => {
    if (err) throw err;
    res.send(result);
  })
})

app.get('/getticketboat/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM ticketboat WHERE booking_id = ? ORDER BY creat_date DESC', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'No ticket found for this booking ID' });
    }
    res.json({ data: result[0] }); // ส่งข้อมูลเฉพาะตัวแรก
  });
});
// });

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
  console.log(date, time)

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

//   SELECT 
//   date, 
//   time, 
//   SUM(adults) AS total_adults, 
//   SUM(children) AS total_children, 
//   SUM(adults + children) AS total_people 
// FROM 
//   ticketboat 
// WHERE 
//   date = '24-09-2024'
// GROUP BY 
//   date, time;

  // Execute the SQL query
  db.query(query, [date, time], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    } else {
      if (results.length > 0) {
        const result = results[0];
        console.log(result);
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

app.get('/getCounterTicketByDay', (req, res) => {
  const date = req.query.date; 
  console.log(date);
    if (!date) {
        return res.status(400).send('Date parameter is required.');
    }

  const query = `
    SELECT 
      date, 
      time, 
      SUM(adults) AS total_adults, 
      SUM(children) AS total_children, 
      SUM(total_people) AS total_people,
      SUM(amount) AS total_price
    FROM 
      ticketboat 
    WHERE 
      date = ?
    GROUP BY 
      date, time;
  `;

  db.query(query, [date], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.send(result);
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

function generateWorkOrderNumber() {
  const now = new Date();
  const datePrefix = now.toISOString().slice(2, 8).replace(/-/g, ''); // YYMM

  const counterFilePath = path.join(__dirname, 'counter.json');
  let counter;

  try {
    const data = fs.readFileSync(counterFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    if (jsonData.date === datePrefix.slice(0, 4)) { // YYMM
      counter = jsonData.count + 1;
    } else {
      counter = 1;
    }
  } catch (error) {
    counter = 1;
  }

  const paddedCounter = String(counter).padStart(5, '0');
  const workOrderNumber = `${datePrefix}${paddedCounter}`;

  // บันทึกค่าตัวนับลงในไฟล์
  const jsonData = JSON.stringify({
    date: datePrefix.slice(0, 4),
    count: counter
  });
  fs.writeFileSync(counterFilePath, jsonData, 'utf8');

  return workOrderNumber;
}
app.post('/addTicketboat', (req, res) => {
  const {
    id,
    date,
    time,
    adults,
    children,
    total_people,
    vat,
    amount,
    total_price,
    first_name,
    last_name,
    email,
    tel,
    address,
    province,
    district,
    subdistrict,
    zip_code,
    note,
    creat_date
  } = req.body;
  booking_id = generateWorkOrderNumber()
  const status = "รอชำระเงิน";
  const sql = `
    INSERT INTO ticketboat (id,booking_id,date, time, adults, children, total_people,vat,amount, total_price, first_name, last_name, email, tel, address, province, district, subdistrict, zip_code, note, status, creat_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
  `;

  db.query(sql, [
    id,
    booking_id,
    date,
    time,
    adults,
    children,
    total_people,
    vat,
    amount,
    total_price,
    first_name,
    last_name,
    email,
    tel,
    address,
    province,
    district,
    subdistrict,
    zip_code,
    note,
    status,
    creat_date
  ], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.status(201).json({ message: 'Record added successfully', id: result.insertId });
  });
});


app.put('/updateTicketboat/:id', (req, res) => {
  const ticketId = req.params.id;
  const {
    date,
    time,
    adults,
    children,
    total_people,
    vat,
    amount,
    total_price,
    first_name,
    last_name,
    email,
    tel,
    address,
    province,
    district,
    subdistrict,
    zip_code,
    note,
    status
  } = req.body;

  const sql = `
    UPDATE ticketboat
    SET date = ?, time = ?, adults = ?, children = ?, total_people = ?,
        vat = ?, amount = ?, total_price = ?, first_name = ?, last_name = ?,
        email = ?, tel = ?, address = ?, province = ?, district = ?,
        subdistrict = ?, zip_code = ?, note = ?, status = ?
    WHERE id = ?
  `;

  db.query(sql, [
    date,
    time,
    adults,
    children,
    total_people,
    vat,
    amount,
    total_price,
    first_name,
    last_name,
    email,
    tel,
    address,
    province,
    district,
    subdistrict,
    zip_code,
    note,
    status,
    ticketId
  ], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json({ message: 'Record updated successfully' });
  });
});


app.post('/register', (req, res) => {
  const { id, username, password, email, tel, first_name, last_name, date_of_birth, gender, role, profile_picture_url } = req.body;

  // Get current date in DD-MM-YY format
  const currentDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).replace(/\//g, '-');

  const sql = `
    INSERT INTO users (	user_id, username, password, email, tel, first_name, last_name, date_of_birth, gender, role, profile_picture_url, status, created_at, updated_at, last_login)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    id, username, password, email, tel, first_name, last_name, date_of_birth, gender, role, profile_picture_url,
    'active',
    currentDate, currentDate, currentDate
  ], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    res.status(201).json({ message: 'Record added successfully', id: result.insertId });
  });
});

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Changed to true for SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  requireTLS: true,
  debug: true, // เพิ่มบรรทัดนี้
  logger: true // และบรรทัดนี้
});

app.post('/send-email', async (req, res) => {
  try {
    let { id, date, time, adults, children, total_people, total_price, first_name, last_name, email, tel, address } = req.body;

    if (!email) {
      console.error('Email is required but not provided:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Sending email to:', email);
    console.log("time:", time);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS is set:', !!process.env.EMAIL_PASS);
console.log('EmailHTML path:', process.env.EmailHTML);

    const adultTotal = adults * 1500;
    const childrenTotal = children * 1000;
    const vat = 7;
    const totalVat = (((adultTotal + childrenTotal) * vat) / 100);

    // if (isNaN(Date.parse(date))) {
    //   return res.status(400).json({ error: 'Invalid date format' });
    // }
    // date = format(new Date(date), 'dd/MM/yyyy');

    console.log('Generating QR Code...');
    const qrCodeUrl = await QRCode.toDataURL(id);
    console.log('QR Code generated successfully');

    const emailData = {
      id, date, time, adults, children, total_people,
      first_name, last_name, email, tel, address,
      adultTotal, childrenTotal, totalVat, total_price, qrCodeUrl
    };

    console.log('Reading HTML template...');
    const htmlTemplate = fs.readFileSync(process.env.EmailHTML, 'utf8');
    console.log('HTML template read successfully');

    const template = handlebars.compile(htmlTemplate);
    const htmlToSend = template(emailData);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "E-Ticket สำหรับการเดินทางเรือของคุณ - [True Lesing / Ayutaya]",
      html: htmlToSend
    };

    console.log('Sending email...');
    let info;
    try {
      transporter.verify(function(error, success) {
        if (error) {
          console.log('SMTP connection error:', error);
        } else {
          console.log("SMTP connection is ready to take our messages");
        }
      });
      
      
      info = await transporter.sendMail(mailOptions);
      if (info.rejected.length > 0) {
        console.error('Email was rejected:', info.rejected);
        throw new Error('Email was rejected');
      }
      console.log('Email sent:', info.response);
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully', info: info.response });
    } catch (emailError) {
      console.error('Error in transporter.sendMail:', emailError);
      console.error('Error details:', JSON.stringify(emailError, null, 2));
      res.status(500).json({ error: 'Failed to send email', details: emailError.message, stack: emailError.stack });
    }
  } catch (error) {
    console.error('Error in email sending process:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to send email', details: error.message, stack: error.stack });
  }
});


const createCharge = (source, amount, ticketId) => {
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


app.get('/provinces', async (req, res) => {
  db.query('SELECT * FROM thai_provinces', (err, result) => {
    if (err) throw err;
    res.send(result);
  })
})

app.get('/districts', async (req, res) => {

  let query = 'SELECT * FROM thai_amphures';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Error querying database');
    }
    res.send(result);
  });
});

app.get('/subdistricts', async (req, res) => {

  let query = 'SELECT * FROM thai_tambons';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Error querying database');
    }
    res.send(result);
  });
});

app.get('/zipcode', async (req, res) => {
  const subdistrictId = req.query.subdistrict_id;

  let query = 'SELECT * FROM thai_tambons';
  let queryParams = [];

  if (subdistrictId && subdistrictId !== 'null' && subdistrictId !== 'undefined') {
    query += ' WHERE id = ?';
    queryParams.push(subdistrictId);
  }

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Error querying database');
    }
    res.send(result);
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  let query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], async (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Error querying database');
    }

    if (result.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = result[0];
    if (user.password === password) {
      const { id, username, role, first_name, last_name } = user;
      const token = jwt.sign({ id, username, role, first_name, last_name }, secret, { expiresIn: "1d" });
      res.json(token);
    } else {
      return res.status(401).send('Invalid password');
    }
  });
});
app.post('/authen', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header is required');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Token is required');
  }

  try {
    const decoded = jwt.verify(token, secret);
    res.json(decoded);
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(401).send('Invalid or expired token');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

});
