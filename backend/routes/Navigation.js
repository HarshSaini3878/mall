import express from 'express';
import Location from '../models/Location.js'; // ✅ use correct filename with .js

const router = express.Router();

export default router;

router.post('/navigate', async (req, res) => {
  const { startGate, startFloor, destination } = req.body;

  const start = await Location.findOne({ name: startGate, floor: startFloor });
  const end = await Location.findOne({ name: destination });

  if (!start || !end) {
    return res.status(404).json({ message: 'Start or Destination not found' });
  }

  res.json({
    path: [`Go from ${start.name} on Floor ${start.floor} to ${end.name} on Floor ${end.floor}`],
    from: start,
    to: end,
  });
});