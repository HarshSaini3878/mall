import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'visitor'],
    required: true,
  },
  maps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Map',
    }
  ]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
