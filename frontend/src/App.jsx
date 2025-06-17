import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminGridEditor from './components/admin/malleditor';
import Room from './components/visitor/room';


function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path='/admin' element={<AdminGridEditor/>}/>
       <Route path='/room/:roomCode' element={<Room/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
