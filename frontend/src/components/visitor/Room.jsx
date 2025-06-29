"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Board from "../board"
import { findPath } from "../pathfindingutils.js"

export default function Room() {
  const { roomCode } = useParams()

  const [grid, setGrid] = useState([])
  const [layoutInfo, setLayoutInfo] = useState(null)
  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const [pathCells, setPathCells] = useState([])
  const [mode, setMode] = useState("start")
  const [pathFound, setPathFound] = useState(null)

  useEffect(() => {
    if (!roomCode) return

    const savedLayout = localStorage.getItem(roomCode)
    if (savedLayout) {
      try {
        const layoutData = JSON.parse(savedLayout)
        const rows = layoutData.length
        const cols = layoutData[0].length
        setGrid(layoutData)
        setLayoutInfo({ roomCode, rows, cols })
      } catch (error) {
        console.error("Error parsing layout:", error)
        createEmptyGrid()
      }
    } else {
      console.warn("No layout found for this room code")
      createEmptyGrid()
    }
  }, [roomCode])

  const createEmptyGrid = () => {
    const emptyGrid = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({ type: "empty" })),
      )
    setGrid(emptyGrid)
    setLayoutInfo({ roomCode: roomCode || "unknown", rows: 10, cols: 10 })
  }

  const handleCellClick = (row, col) => {
    if (mode === "start") {
      setStartPoint({ row, col })
      setPathCells([])
      setPathFound(null)
    } else if (mode === "end") {
      setEndPoint({ row, col })
      setPathCells([])
      setPathFound(null)
    }
  }

  const findPathBetweenPoints = () => {
    if (!startPoint || !endPoint) {
      alert("Please set both start and end points!")
      return
    }

    const path = findPath(grid, startPoint, endPoint)
    setPathCells(path)
    setPathFound(path.length > 0)
  }

  const clearPath = () => {
    setPathCells([])
    setPathFound(null)
  }

  const clearPoints = () => {
    setStartPoint(null)
    setEndPoint(null)
    setPathCells([])
    setPathFound(null)
  }

  const getPathStats = () => {
    if (!pathFound) return null

    const distance = pathCells.length + 1
    const shopsOnPath = pathCells.filter((cell) => grid[cell.row][cell.col].type === "shop").length
    const gatesOnPath = pathCells.filter((cell) => grid[cell.row][cell.col].type === "gate").length

    return { distance, shopsOnPath, gatesOnPath }
  }

  if (grid.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mall layout...</p>
        </div>
      </div>
    )
  }

  const stats = getPathStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-2xl border-b-4 border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-white text-center tracking-wider">🏬 MALL NAVIGATOR</h1>
          <p className="text-slate-300 text-center mt-2">
            Room Code: {roomCode} • Grid: {layoutInfo?.rows}×{layoutInfo?.cols}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => setMode("start")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg border-2 ${
                  mode === "start"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400 shadow-xl"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 hover:shadow-lg"
                }`}
              >
                Set Start Point
              </button>
              <button
                onClick={() => setMode("end")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg border-2 ${
                  mode === "end"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-xl"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 hover:shadow-lg"
                }`}
              >
                Set End Point
              </button>
            </div>

            <div className="flex gap-2 border-l-2 border-gray-300 pl-4">
              <button
                onClick={findPathBetweenPoints}
                disabled={!startPoint || !endPoint}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Find Path
              </button>
              <button
                onClick={clearPath}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Clear Path
              </button>
              <button
                onClick={clearPoints}
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {stats && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border border-purple-200">
            <h3 className="font-semibold text-gray-700 mb-2">Path Statistics:</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.distance}</div>
                <div className="text-gray-600">Steps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.shopsOnPath}</div>
                <div className="text-gray-600">Shops Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.gatesOnPath}</div>
                <div className="text-gray-600">Gates Passed</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Board
        grid={grid}
        onCellClick={handleCellClick}
        startPoint={startPoint}
        endPoint={endPoint}
        pathCells={pathCells}
        rows={layoutInfo?.rows || 10}
        cols={layoutInfo?.cols || 10}
      />
    </div>
  )
}