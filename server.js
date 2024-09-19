const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const smtp2goApiKey = 'api-399C67225C9940649457600191474591'; // Your SMTP2GO API key

// Create email transporter for sending emails
const transporter = nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    port: 587,
    auth: {
        user: 'temp55', // replace with your SMTP2GO username
        pass: 'temp' // replace with your SMTP2GO password
    }
});

// Create Account Endpoint
app.post('/create-account', async (req, res) => {
    const { username, password } = req.body;

    try {
        const response = await axios.post('https://api.smtp2go.com/v1/users', {
            username: username,
            password: password
        }, {
            headers: {
                'Authorization': `Bearer ${smtp2goApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).send('Account created successfully: ' + response.data);
    } catch (error) {
        res.status(500).send('Error creating account: ' + error.response.data.message);
    }
});

// Send Email Endpoint
app.post('/send-email', (req, res) => {
    const { recipient, subject, message } = req.body;

    const mailOptions = {
        from: 'youremail@squidwardproject.com', // replace with your email
        to: recipient,
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
