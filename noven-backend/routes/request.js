const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});
const upload = multer({ storage });

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	service: 'Gmail', // Use your email service
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

// Handle form submission
router.post('/', upload.array('files'), (req, res) => {
	const formData = req.body;
	const files = req.files;

	console.log('Form data:', formData);
	console.log('Files:', files);

	// Construct email message
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: process.env.RECEIVER_EMAILS, // Comma separated list of recipients
		subject: 'New Request for Proposal',
		text: `New Request for Proposal\n\n
    First Name: ${formData.firstName}\n
    Last Name: ${formData.lastName}\n
    Position/Job Title: ${formData.jobTitle}\n
    Email: ${formData.email}\n
    Phone: ${formData.phone}\n
    Country: ${formData.country?.label}\n
    State: ${formData.state?.label}\n
    City: ${formData.city?.label}\n
    Company Name: ${formData.companyName}\n
    Industry: ${formData.industry}\n
    Additional Information: ${formData.additionalInfo}`,
	};

	// Attach files if any
	if (files.length > 0) {
		mailOptions.attachments = files.map((file) => ({
			filename: file.originalname,
			path: file.path,
		}));
	}

	// Send email
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending email:', error);
			return res.status(500).json({ message: 'Error sending email' });
		}
		console.log('Email sent:', info.response);
		res.status(200).json({ message: 'Form submitted successfully!' });
	});
});

module.exports = router;
