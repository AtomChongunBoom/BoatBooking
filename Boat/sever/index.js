const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser'); // To use environment variables

const app = express();
const port = 3000;

// Configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure:false, // Or your email service provider
  auth: {
    user: 'atom.14110@gmail.com', // Email from environment variables
    pass: 'At0876167195'  // Password from environment variables
  }
});

// Route to send email
app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  // Simple validation
  if (!to || !subject || !text) {
    console.error(req.body);
    return res.status(400).send('Missing required fields');
  }

  const mailOptions = {
    from: 'atom.141101@gmail.com', // Email sender
    to: to,                      // Recipient email
    subject: subject,            // Email subject
    text: text                   // Email body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error: ', error);
      return res.status(500).send(error);
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});