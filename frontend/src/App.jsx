import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminGridEditor from './components/admin/malleditor';
import Room from './components/visitor/room';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} /> {/* Added this line */}
        <Route path='/admin' element={<AdminGridEditor />} />
        <Route path='/room/:roomCode' element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
