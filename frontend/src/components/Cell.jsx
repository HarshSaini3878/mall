

export default function Cell({ type, row, col, onClick, isStart = false, isEnd = false, isPath = false }) {
  const getCellStyles = () => {
    const baseStyles =
      "w-8 h-8 border border-gray-300 cursor-pointer transition-all duration-200 hover:scale-105 relative overflow-hidden"

    if (isStart) {
      return `${baseStyles} bg-gradient-to-br from-green-400 to-green-600 
              shadow-lg border-green-700 transform hover:shadow-xl ring-2 ring-green-300`
    }

    if (isEnd) {
      return `${baseStyles} bg-gradient-to-br from-red-400 to-red-600 
              shadow-lg border-red-700 transform hover:shadow-xl ring-2 ring-red-300`
    }

    if (isPath) {
      return `${baseStyles} bg-gradient-to-br from-yellow-300 to-yellow-400 
              shadow-md border-yellow-500 animate-pulse ring-1 ring-yellow-300`
    }

    switch (type) {
      case "shop":
        return `${baseStyles} bg-gradient-to-br from-green-300 via-green-400 to-green-500 
                shadow-lg border-green-600 transform hover:shadow-xl`
      case "obstacle":
        return `${baseStyles} bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 
                shadow-lg transform hover:shadow-xl border-orange-700
                before:absolute before:inset-0 before:bg-gradient-to-r 
                before:from-transparent before:via-orange-300 before:to-transparent
                before:bg-[length:8px_100%] before:opacity-60`
      case "gate":
        return `${baseStyles} bg-gradient-to-br from-blue-400 to-blue-600 
                shadow-lg border-blue-700 transform hover:shadow-xl`
      
      default: // empty
        return `${baseStyles} bg-gradient-to-br from-gray-50 to-gray-100 
                shadow-sm hover:shadow-md border-gray-400`
    }
  }

  const getCellContent = () => {
    if (isStart) return <span className="text-white font-bold text-xs">S</span>
    if (isEnd) return <span className="text-white font-bold text-xs">E</span>

    switch (type) {
      case "shop":
        return <span className="text-white font-bold text-xs">🏪</span>
      case "gate":
        return <span className="text-white font-bold text-xs">🚪</span>
      case "obstacle":
        return (
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)",
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className={getCellStyles()}
      onClick={() => onClick && onClick(row, col)}
      style={{
        boxShadow:
          type === "obstacle"
            ? "0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)"
            : "0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">{getCellContent()}</div>
      {/* 3D highlight effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
    </div>
  )
}
