import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Pages from './components/pages';
import Activation from './pages/activation'
import RegisterUser from './pages/Register';
import ForgotPassword from './pages/forgotPassword';
import UpdatePassword from './pages/newPassword';

function App() {
  
  return (
    <div className="flex justify-center">
      
      <div className="w-[480px] z-0">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/activation' element={<Activation />} />
          <Route path='/register' element={<RegisterUser />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/updatePassword/:uid' element={<UpdatePassword />} />
        </Routes>
        <Footer />
      </div>
      </div>
    )
  }

export default App;
