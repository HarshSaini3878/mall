import { useState } from 'react';

const GRID_ROWS = 10;
const GRID_COLS = 10;
const ADMIN_PASSWORD = 'admin123'; // 🔑 Set your password here

const defaultCell = () => ({
  type: 'empty', // 'shop', 'obstacle', 'gate'
});

export default function MallEditor() {
  const [grid, setGrid] = useState(
    Array(GRID_ROWS)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(null).map(defaultCell))
  );
  const [selectedType, setSelectedType] = useState('shop');
  const [savedLayout, setSavedLayout] = useState(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleCellClick = (row, col) => {
    const newGrid = grid.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? { type: selectedType } : c))
    );
    setGrid(newGrid);
  };

  const handleSave = () => {
    const layoutData = {
      roomCode: 'delhimall',
      layout: grid,
      floor: 1,
      rows: GRID_ROWS,
      cols: GRID_COLS,
    };

    localStorage.setItem(`layout-${layoutData.roomCode}`, JSON.stringify(layoutData));
    setSavedLayout(layoutData);
    alert('Layout saved successfully!');
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Incorrect Password!');
    }
  };

  // Login Page
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded mb-4"
        />
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Login
        </button>
      </div>
    );
  }

  // Admin Grid Editor Page
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Grid Editor</h1>

      <div className="mb-2 flex gap-2 flex-wrap">
        {['shop', 'obstacle', 'gate', 'empty'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1 rounded border 
              ${selectedType === type ? 'bg-black text-white' : 'bg-white text-black border-gray-400'}`}
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
                  cell.type === 'gate' ? 'bg-blue-400' : 'bg-gray-100'}`}
            ></div>
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
