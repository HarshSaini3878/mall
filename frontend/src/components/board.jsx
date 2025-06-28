

import Cell from "./Cell"

export default function Board({
  grid,
  onCellClick,
  startPoint = null,
  endPoint = null,
  pathCells = [],
  rows,
  cols,
}) {
  const isStartPoint = (row, col) => {
    return startPoint && startPoint.row === row && startPoint.col === col
  }

  const isEndPoint = (row, col) => {
    return endPoint && endPoint.row === row && endPoint.col === col
  }

  const isPathCell = (row, col) => {
    return pathCells.some((cell) => cell.row === row && cell.col === col)
  }

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-slate-100 to-slate-200">
      <div
        className="inline-block p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border-4 border-slate-700"
        style={{
          boxShadow: `
            0 25px 50px rgba(0,0,0,0.4),
            0 0 0 1px rgba(255,255,255,0.1),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.3)
          `,
        }}
      >
        {/* Board inner frame */}
        <div
          className="p-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl border-2 border-slate-500"
          style={{
            boxShadow: `
              inset 0 4px 8px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
          }}
        >
          {/* Grid container */}
          <div
            className="grid gap-1 p-3 bg-gradient-to-br from-slate-300 to-slate-400 rounded-lg border border-slate-400"
            style={{
              gridTemplateColumns: `repeat(${cols}, 32px)`,
              boxShadow: `
                inset 0 2px 4px rgba(0,0,0,0.2),
                0 1px 0 rgba(255,255,255,0.3)
              `,
            }}
          >
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <Cell
                  key={`${i}-${j}`}
                  type={cell.type}
                  row={i}
                  col={j}
                  onClick={onCellClick}
                  isStart={isStartPoint(i, j)}
                  isEnd={isEndPoint(i, j)}
                  isPath={isPathCell(i, j)}
                />
              )),
            )}
          </div>
        </div>

        {/* Board label */}
        <div className="text-center mt-4">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg border border-slate-500 shadow-lg">
            <span className="text-white font-bold text-sm tracking-wider">DELHI MALL NAVIGATOR</span>
          </div>
        </div>
      </div>
    </div>
  )
}
