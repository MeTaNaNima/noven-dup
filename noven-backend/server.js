const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const requestRouter = require('./routes/request');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/request', requestRouter);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
