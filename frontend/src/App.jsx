import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminGridEditor from './components/admin/malleditor';


function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path='/admin' element={<AdminGridEditor/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
