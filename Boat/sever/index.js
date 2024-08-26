const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); // To use environment variables

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
