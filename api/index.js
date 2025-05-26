const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Transaction = require('./models/transaction.js');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.post('/api/transaction', async (req, res) => {
  try {
    const { name, description, datetime, price } = req.body;
    const transaction = await Transaction.create({ name, description, datetime, price });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ datetime: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Server listening
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});