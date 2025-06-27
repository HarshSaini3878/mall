import express from 'express';
import Location from '../models/Location.js';

const router = express.Router();

// Helper function to calculate Euclidean distance
function calculateDistance(coord1, coord2) {
  return Math.sqrt(
    Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2)
  );
}

// Dijkstra's algorithm (simplified for dense graph from MongoDB)
function dijkstra(graph, startNode) {
  const distances = {};
  const visited = new Set();

  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  while (visited.size < Object.keys(graph).length) {
    let currentNode = null;
    let minDistance = Infinity;

    for (const node of Object.keys(distances)) {
      if (!visited.has(node) && distances[node] < minDistance) {
        currentNode = node;
        minDistance = distances[node];
      }
    }

    if (currentNode === null) break;

    visited.add(currentNode);

    for (const neighbor in graph[currentNode]) {
      const distance = graph[currentNode][neighbor];
      const total = distances[currentNode] + distance;
      if (total < distances[neighbor]) {
        distances[neighbor] = total;
      }
    }
  }

  return distances;
}

router.post('/navigate', async (req, res) => {
  const { startGate, startFloor, destination } = req.body;

  const locations = await Location.find();

  const start = locations.find(loc => loc.name === startGate && loc.floor === startFloor);
  const end = locations.find(loc => loc.name === destination);

  if (!start || !end) {
    return res.status(404).json({ message: 'Start or destination not found' });
  }

  // Build graph (fully connected for now)
  const graph = {};
  for (let loc1 of locations) {
    graph[loc1.name] = {};
    for (let loc2 of locations) {
      if (loc1.name !== loc2.name) {
        graph[loc1.name][loc2.name] = calculateDistance(loc1.coordinates, loc2.coordinates);
      }
    }
  }

  // 1. Distance from gate to destination
  const distancesFromStart = dijkstra(graph, start.name);
  const gateToDestDistance = distancesFromStart[end.name];

  // 2. Distances from destination to all
  const distancesFromDestination = dijkstra(graph, end.name);

  res.json({
    message: `Path from ${start.name} to ${end.name} computed.`,
    pathDistance: gateToDestDistance,
    allDistancesFromDestination: distancesFromDestination
  });
});

export default router;
