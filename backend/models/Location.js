import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  name: String,
  type: String,
  floor: Number,
  coordinates: {
    x: Number,
    y: Number
  }
});

const Location = mongoose.model('Location', LocationSchema);
export default Location;