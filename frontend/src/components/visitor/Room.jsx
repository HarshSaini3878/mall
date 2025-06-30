import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Room() {
  const { roomCode } = useParams();

  const [layoutData, setLayoutData] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!roomCode) return;

    const saved = localStorage.getItem(`layout-${roomCode}`);
    if (saved) {
      setLayoutData(JSON.parse(saved));
    }
  }, [roomCode]);

  const handleCellClick = (row, col) => {
    const cellType = layoutData.layout[row][col].type;

    if (!start) {
      if (cellType !== 'gate') {
        setError('You must start from a gate!');
        return;
      }
      setStart([row, col]);
      setError('');
    } else if (!end) {
      setEnd([row, col]);
    }
  };

  useEffect(() => {
    if (layoutData && start && end) {
      const result = findPathThroughShops(layoutData.layout, start, end);
      setPath(result);
    }
  }, [layoutData, start, end]);

  const findAllShops = (grid) => {
    const shops = [];
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.type === 'shop') {
          shops.push([i, j]);
        }
      });
    });
    return shops;
  };

  const bfs = (grid, start, end) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const queue = [[...start, []]];
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    while (queue.length > 0) {
      const [r, c, p] = queue.shift();

      if (r === end[0] && c === end[1]) return [...p, [r, c]];
      if (visited[r][c]) continue;
      visited[r][c] = true;

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
          !visited[nr][nc] && grid[nr][nc].type !== 'obstacle'
        ) {
          queue.push([nr, nc, [...p, [r, c]]]);
        }
      }
    }

    return null;
  };

  const findPathThroughShops = (grid, start, end) => {
    let shops = findAllShops(grid);
    let currentPos = start;
    let fullPath = [];

    while (shops.length > 0) {
      shops.sort((a, b) => {
        const distA = Math.abs(a[0] - currentPos[0]) + Math.abs(a[1] - currentPos[1]);
        const distB = Math.abs(b[0] - currentPos[0]) + Math.abs(b[1] - currentPos[1]);
        return distA - distB;
      });

      const nearestShop = shops.shift();
      const pathToShop = bfs(grid, currentPos, nearestShop);

      if (!pathToShop) {
        setError('No path to a shop found!');
        return [];
      }

      fullPath = [...fullPath, ...pathToShop];
      currentPos = nearestShop;
    }

    const pathToEnd = bfs(grid, currentPos, end);
    if (!pathToEnd) {
      setError('No path to the end point!');
      return [];
    }

    fullPath = [...fullPath, ...pathToEnd];
    return fullPath;
  };

  if (!layoutData) return <div className="p-8 text-xl font-bold text-center">Loading layout...</div>;

  const { layout, rows, cols } = layoutData;

  const isPath = (i, j) => path.some(([r, c]) => r === i && c === j);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 space-y-8">
      <motion.h1
        className="text-4xl font-extrabold text-gray-800"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Mall Navigation: {roomCode}
      </motion.h1>

      <p className="text-lg text-gray-600">Click to select <span className="font-bold text-blue-600">Start (Gate)</span> → <span className="font-bold text-purple-600">End</span></p>

      {error && (
        <div className="text-red-500 text-lg font-semibold">{error}</div>
      )}

      <div
        className="grid border-4 border-gray-300 rounded-lg p-4 bg-white shadow-lg"
        style={{ gridTemplateColumns: `repeat(${cols}, 40px)`, gap: '4px' }}
      >
        {layout.map((row, i) =>
          row.map((cell, j) => {
            const isStartCell = start && start[0] === i && start[1] === j;
            const isEndCell = end && end[0] === i && end[1] === j;
            const onPath = isPath(i, j);

            return (
              <motion.div
                key={`${i}-${j}`}
                onClick={() => handleCellClick(i, j)}
                whileHover={{ scale: 1.1 }}
                className={`w-10 h-10 border rounded cursor-pointer flex items-center justify-center text-[10px] select-none
                  transition-all duration-200 ease-in-out
                  ${cell.type === 'shop' ? 'bg-green-500 hover:bg-green-600' :
                    cell.type === 'obstacle' ? 'bg-red-500 hover:bg-red-600' :
                    cell.type === 'gate' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'}
                  ${isStartCell ? 'ring-4 ring-yellow-500' : ''}
                  ${isEndCell ? 'ring-4 ring-purple-500' : ''}
                  ${onPath ? 'bg-yellow-200' : ''}
                `}
              ></motion.div>
            );
          })
        )}
      </div>

      {start && end && (
        <motion.div
          className="mt-4 text-lg text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {path.length > 0
            ? `Path found with ${path.length} steps, visiting all shops.`
            : 'No path found!'}
        </motion.div>
      )}
    </div>
  );
}
<footer className="mt-8 text-center text-gray-500 text-sm">
  Made with ❤️ to save your time
</footer>
