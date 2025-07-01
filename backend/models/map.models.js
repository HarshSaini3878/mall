import mongoose from 'mongoose';

const mapSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  roomCode: {
    type: String,
    required: true,
  },
  layout: {
    type: Array,  // If you want stricter validation, let me know
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  rows: {
    type: Number,
    required: true,
  },
  cols: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Map', mapSchema);
