// Simple A* pathfinding algorithm
export function findPath(grid, start, end) {
  const rows = grid.length
  const cols = grid[0].length

  // Check if start or end is an obstacle
  if (grid[start.row][start.col].type === "obstacle" || grid[end.row][end.col].type === "obstacle") {
    return []
  }

  const openSet = [start]
  const closedSet = new Set()
  const cameFrom = new Map()
  const gScore = new Map()
  const fScore = new Map()

  // Initialize scores
  const getKey = (row, col) => `${row},${col}`
  gScore.set(getKey(start.row, start.col), 0)
  fScore.set(getKey(start.row, start.col), heuristic(start, end))

  while (openSet.length > 0) {
    // Find node with lowest fScore
    const current = openSet.reduce((lowest, node) => {
      const currentF = fScore.get(getKey(node.row, node.col)) || Number.POSITIVE_INFINITY
      const lowestF = fScore.get(getKey(lowest.row, lowest.col)) || Number.POSITIVE_INFINITY
      return currentF < lowestF ? node : lowest
    })

    if (current.row === end.row && current.col === end.col) {
      // Reconstruct path
      const path = []
      let temp = current
      while (temp) {
        path.unshift(temp)
        temp = cameFrom.get(getKey(temp.row, temp.col))
      }
      return path.slice(1, -1) // Remove start and end points
    }

    openSet.splice(openSet.indexOf(current), 1)
    closedSet.add(getKey(current.row, current.col))

    // Check neighbors
    const neighbors = getNeighbors(current, rows, cols)
    for (const neighbor of neighbors) {
      const neighborKey = getKey(neighbor.row, neighbor.col)

      if (closedSet.has(neighborKey)) continue
      if (grid[neighbor.row][neighbor.col].type === "obstacle") continue

      const tentativeGScore = (gScore.get(getKey(current.row, current.col)) || Number.POSITIVE_INFINITY) + 1

      if (!openSet.some((node) => node.row === neighbor.row && node.col === neighbor.col)) {
        openSet.push(neighbor)
      } else if (tentativeGScore >= (gScore.get(neighborKey) || Number.POSITIVE_INFINITY)) {
        continue
      }

      cameFrom.set(neighborKey, current)
      gScore.set(neighborKey, tentativeGScore)
      fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end))
    }
  }

  return [] // No path found
}

function heuristic(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
}

function getNeighbors(node, rows, cols) {
  const neighbors = []
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1], // up, down, left, right
  ]

  for (const [dr, dc] of directions) {
    const newRow = node.row + dr
    const newCol = node.col + dc

    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      neighbors.push({ row: newRow, col: newCol })
    }
  }

  return neighbors
}
