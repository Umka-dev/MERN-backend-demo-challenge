require('dotenv').config();
const mongoose = require('mongoose');

const DB_URI =
  'mongodb+srv://designtvin:SPf3SzwXpWKvI3tt@backend1.b57bhlh.mongodb.net/my-db?retryWrites=true&w=majority&appName=Backend1';

if (!DB_URI) {
  console.error('❌ MongoDB URI is missing! Check your .env file.');
  process.exit(1);
}

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('✅ DB is connected');
  })
  .catch((err) => {
    console.log('❌ MongoDB connection error: ', err);
  });
