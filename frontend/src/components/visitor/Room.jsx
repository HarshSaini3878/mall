import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Room() {
  const { roomCode } = useParams();

  const [layoutData, setLayoutData] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);

  useEffect(() => {
    if (!roomCode) return;

    const saved = localStorage.getItem(`layout-${roomCode}`);
    if (saved) {
      setLayoutData(JSON.parse(saved));
    }
  }, [roomCode]);

  const handleCellClick = (row, col) => {
    if (!start) setStart([row, col]);
    else if (!end) setEnd([row, col]);
  };

  useEffect(() => {
    if (layoutData && start && end) {
      const result = bfs(layoutData.layout, start, end);
      setPath(result);
    }
  }, [layoutData, start, end]);

  const bfs = (grid, start, end) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    const queue = [[...start, []]]; // [row, col, path]
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

    return [];
  };

  if (!layoutData) return <div className="p-4">Loading layout...</div>;

  const { layout, rows, cols } = layoutData;

  const isPath = (i, j) => path.some(([r, c]) => r === i && c === j);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mall View: {roomCode}</h1>
      <p className="mb-2 text-sm">Click to select Start → End</p>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 28px)`, gap: '2px' }}>
        {layout.map((row, i) =>
          row.map((cell, j) => {
            const isStartCell = start && start[0] === i && start[1] === j;
            const isEndCell = end && end[0] === i && end[1] === j;
            const onPath = isPath(i, j);
            return (
              <div
                key={`${i}-${j}`}
                onClick={() => handleCellClick(i, j)}
                className={`w-7 h-7 border rounded cursor-pointer flex items-center justify-center text-[10px] select-none
                  ${cell.type === 'shop' ? 'bg-green-400' :
                    cell.type === 'obstacle' ? 'bg-red-400' :
                    cell.type === 'gate' ? 'bg-blue-400' : 'bg-gray-100'}
                  ${isStartCell ? 'ring-2 ring-yellow-500' : ''}
                  ${isEndCell ? 'ring-2 ring-purple-500' : ''}
                  ${onPath ? 'bg-yellow-200' : ''}
                `}
              ></div>
            );
          })
        )}
      </div>

      {start && end && (
        <div className="mt-4 text-sm">
          {path.length > 0
            ? `Path found with ${path.length} steps.`
            : 'No path found!'}
        </div>
      )}
    </div>
  );
}
