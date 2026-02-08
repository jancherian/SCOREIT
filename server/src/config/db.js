const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI is not defined in environment variables');
} else {
  mongoose.set('strictQuery', true);

  mongoose
    .connect(uri, {
      autoIndex: true,
    })
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

module.exports = mongoose.connection;

