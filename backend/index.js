import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import navigationRoute from './routes/Navigation.js';

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mall', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api', navigationRoute);

app.listen(5000, () => console.log('✅ Server running on port 5000'));
