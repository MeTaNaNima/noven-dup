const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/projects', require('./routes/projects'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
