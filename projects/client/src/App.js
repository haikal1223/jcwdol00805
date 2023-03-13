import logo from './logo.svg';
import './App.css';
import {Route, Routes} from 'react-router-dom'
import Activation from './pages/activation'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/activation' element={<Activation/>}/>
      </Routes>
    </div>
  );
}

export default App;
