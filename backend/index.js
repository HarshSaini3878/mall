import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoute from './routes/user.routes.js';
import { configDotenv } from 'dotenv';
const app = express();
configDotenv();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mall', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


app.use('/api/v1/user', userRoute);

app.listen(5000, () => console.log('✅ Server running on port 5000'));
