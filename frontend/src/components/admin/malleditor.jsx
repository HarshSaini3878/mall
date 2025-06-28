import { useState, useCallback, useEffect } from "react";
import Board from "../board";
import { findPath } from "../pathfindingutils.js";  // Update this import path if needed

const GRID_ROWS = 15;
const GRID_COLS = 20;

const defaultCell = () => ({
  type: "empty",
});

export default function AdminGridEditor() {
  const [grid, setGrid] = useState(
    Array(GRID_ROWS)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(null).map(defaultCell))
  );

  const [selectedType, setSelectedType] = useState("obstacle");
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);
  const [pathCells, setPathCells] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const handleCellClick = useCallback(
    (row, col) => {
      if (isRunning) return;

      if (selectedType === "start") {
        setStartCell({ row, col });
        return;
      }

      if (selectedType === "end") {
        setEndCell({ row, col });
        return;
      }

      const newGrid = grid.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? { type: selectedType } : c))
      );
      setGrid(newGrid);
    },
    [grid, selectedType, isRunning]
  );

  useEffect(() => {
    if (startCell && endCell) {
      const path = findPath(grid, startCell, endCell);
      setPathCells(path);
    } else {
      setPathCells([]);
    }
  }, [startCell, endCell, grid]);

  const clearPath = () => {
    setPathCells([]);
  };

  const clearBoard = () => {
    setGrid(
      Array(GRID_ROWS)
        .fill(null)
        .map(() => Array(GRID_COLS).fill(null).map(defaultCell))
    );
    setStartCell(null);
    setEndCell(null);
    setPathCells([]);
    setSelectedType("obstacle");
  };

  const generateMaze = () => {
    const newGrid = Array(GRID_ROWS)
      .fill(null)
      .map(() =>
        Array(GRID_COLS)
          .fill(null)
          .map(() => (Math.random() < 0.3 ? { type: "obstacle" } : defaultCell()))
      );

    setGrid(newGrid);
    setPathCells([]);
    setStartCell(null);
    setEndCell(null);
  };

  const saveBoard = () => {
    if (!roomCode.trim()) {
      alert("Please enter a room code before saving.");
      return;
    }

    const boardData = grid.map((row, i) =>
      row.map((cell, j) => {
        if (startCell && startCell.row === i && startCell.col === j)
          return { type: "empty" };
        if (endCell && endCell.row === i && endCell.col === j)
          return { type: "empty" };
        return cell;
      })
    );

    localStorage.setItem(roomCode.trim(), JSON.stringify(boardData));
    alert(`Board saved with room code: ${roomCode.trim()}`);
  };

  const toolButtons = [
    { type: "obstacle", label: "Wall", color: "from-orange-500 to-orange-600" },
    { type: "empty", label: "Empty", color: "from-gray-100 to-gray-200 text-gray-800" },
    { type: "start", label: "Start", color: "from-green-500 to-green-600" },
    { type: "end", label: "End", color: "from-red-500 to-red-600" },
    { type: "shop", label: "Shop", color: "from-green-300 to-green-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-2xl border-b-4 border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-white text-center tracking-wider">
            🎯 PATHFINDER VISUALIZER
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex gap-2">
              {toolButtons.map((tool) => (
                <button
                  key={tool.type}
                  onClick={() => setSelectedType(tool.type)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg border-2 ${
                    selectedType === tool.type
                      ? `bg-gradient-to-r ${tool.color} text-white border-gray-400 shadow-xl`
                      : `bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 hover:shadow-lg`
                  }`}
                >
                  {tool.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 border-l-2 border-gray-300 pl-4">
              <button
                onClick={clearPath}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Clear Path
              </button>
              <button
                onClick={generateMaze}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Generate Maze
              </button>
              <button
                onClick={clearBoard}
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center justify-center">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Enter room code"
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={saveBoard}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Save Board
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
          <p className="text-center text-gray-700">
            <span className="font-semibold">Instructions:</span> Select a tool and click on the grid to place elements.
            Set start (S) and end (E) points, then add walls to create obstacles for pathfinding.
          </p>
        </div>
      </div>

      {/* Board */}
      <Board
        grid={grid}
        onCellClick={handleCellClick}
        pathCells={pathCells}
        startPoint={startCell}
        endPoint={endCell}
        rows={GRID_ROWS}
        cols={GRID_COLS}
      />
    </div>
  );
}
