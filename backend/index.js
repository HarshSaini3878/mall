import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import navigationRoute from './routes/Navigation.js'; // ✅ make sure .js is included

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mall', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/api', navigationRoute);

app.listen(5000, () => console.log('✅ Server running on port 5000'));