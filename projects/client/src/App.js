import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom'
import Activation from './pages/activation'
import RegisterUser from './pages/Register';
import ForgotPassword from './pages/forgotPassword';
import UpdatePassword from './pages/newPassword';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/activation' element={<Activation />} />
        <Route path='/register' element={<RegisterUser />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/updatePassword/:uid' element={<UpdatePassword />} />

      </Routes>
    </div>
  );
}

export default App;
