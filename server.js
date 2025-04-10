// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const app = express();

app.use(cors());
app.use(express.json()); // to parse JSON

// Route
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB error:', err));
const userRoute = require('./routes/user');
app.use('/api/user', userRoute);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
