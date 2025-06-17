import { useState } from 'react';

const GRID_ROWS = 10;
const GRID_COLS = 10;

const defaultCell = () => ({
  type: 'empty', // 'shop', 'obstacle', 'gate'
});

export default function AdminGridEditor() {
  const [grid, setGrid] = useState(
    Array(GRID_ROWS)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(null).map(defaultCell))
  );
  const [selectedType, setSelectedType] = useState('shop');
  const [savedLayout, setSavedLayout] = useState(null); // Save locally

  const handleCellClick = (row, col) => {
    const newGrid = grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? { type: selectedType } : c))
    );
    setGrid(newGrid);
  };

  const handleSave = async () => {
    const layoutData = {
      roomCode: 'delhimall',
      layout: grid,
      floor: 1,
      rows: GRID_ROWS,
      cols: GRID_COLS,
    };

    // Commenting out API call
    // const res = await fetch('/api/admin/mall', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(layoutData),
    // });
    // const data = await res.json();
    // alert(data.message || 'Saved!');

    setSavedLayout(layoutData); // Save locally
    alert('Layout saved to local state!');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Grid Editor</h1>

      <div className="mb-2 flex gap-2 flex-wrap">
        {['shop', 'obstacle', 'gate', 'empty'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1 rounded border 
              ${selectedType === type ? 'bg-black text-white' : 'bg-white text-black border-gray-400'}
            `}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 28px)`, gap: '2px' }}>
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => handleCellClick(i, j)}
              className={`w-7 h-7 border rounded cursor-pointer flex items-center justify-center text-[10px] select-none
                ${cell.type === 'shop' ? 'bg-green-400' :
                  cell.type === 'obstacle' ? 'bg-red-400' :
                  cell.type === 'gate' ? 'bg-blue-400' : 'bg-gray-100'}
              `}
            >
              {/* Optional: remove coords if visual clarity is needed */}
              {/* {i},{j} */}
            </div>
          ))
        )}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        onClick={handleSave}
      >
        Save Layout
      </button>

      {savedLayout && (
        <pre className="mt-4 text-xs bg-gray-100 p-2 rounded max-h-60 overflow-auto">
          {JSON.stringify(savedLayout, null, 2)}
        </pre>
      )}
    </div>
  );
}
