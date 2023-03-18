import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Product from "./pages/Product";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Pages from './components/pages';
import Activation from './pages/activation'
import RegisterUser from './pages/Register';
// import ForgotPassword from './pages/forgotPassword';
// import UpdatePassword from './pages/newPassword';

function App() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const keepLoggedIn = () => {
    try {
      const token = localStorage.getItem('myToken')
      if(token) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }

    } catch (error) {
      console.log(error.message)
    }

  }

 useEffect(() => {
  keepLoggedIn()
 })

  return (
    <div className="flex justify-center">
      
      <div className="w-[480px] z-0">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home login={isLoggedIn}/>} />
          <Route path='/activation' element={<Activation />} />
          <Route path='/register' element={<RegisterUser />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/cart' element={
            /* isLoggedIn?
            ( */
              <Cart login={isLoggedIn}/>
            /* )
            :
            (
              navigate('/')
            ) */
          } />
          <Route path='/order' element={
            /* isLoggedIn?
            ( */
              <Order login={isLoggedIn}/>
            /* )
            :
            (
              navigate('/')
            ) */
          } />
          {/* <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/updatePassword/:uid' element={<UpdatePassword />} /> */}
        </Routes>
        <Footer />
        <Toaster />
      </div>
      </div>
    )
  }

export default App;
