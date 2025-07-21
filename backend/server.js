const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FocusFlow API is running...');
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/time-logs', require('./routes/timeLogs'));
app.use('/api/reports', require('./routes/reports'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));