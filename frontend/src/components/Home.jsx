import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-cover bg-center"
      style={{
        backgroundImage: "url('/mallimg.jpeg')",
      }}
    >
      {/* Header */}
      <header className="text-center py-8 bg-white/80 backdrop-blur-sm shadow">
        <h1 className="text-5xl font-extrabold text-indigo-700">
          Welcome to Mall Navigation
        </h1>
        <p className="text-gray-700 text-lg mt-2">
          Explore, Shop, and Find Your Way Effortlessly
        </p>
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-1 p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">

          {/* Visitor Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/90 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-2xl transition duration-300 hover:bg-blue-100"
          >
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Visitor Mode</h2>
            <p className="text-gray-700 mb-4">
              Navigate the mall layout, choose your starting gate and destination.
            </p>
            <Link
              to="/room/delhimall"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Enter Mall
            </Link>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/90 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-2xl transition duration-300 hover:bg-purple-100"
          >
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Admin Mode</h2>
            <p className="text-gray-700 mb-4">
              Create or update the mall layout with shops, obstacles, and gates.
            </p>
            <Link
              to="/admin"
              className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Go to Admin
            </Link>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-700 text-sm py-4 bg-white/80 backdrop-blur-sm shadow-inner">
        Made with ❤️ for our customers to save your time
      </footer>
    </div>
  );
}
