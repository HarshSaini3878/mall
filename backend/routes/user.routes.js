import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Map from '../models/map.models.js';
import User from '../models/user.models.js';

const router = express.Router();

router.post('/save-map', async (req, res) => {
  const { roomCode, layout, floor, rows, cols, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can save maps' });
    }

    const map = await Map.create({
      uuid: uuidv4(),
      roomCode,
      layout,
      floor,
      rows,
      cols,
      createdBy: user._id
    });

    user.maps.push(map._id);
    await user.save();

    res.status(201).json({ message: 'Map saved successfully', map });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
