import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import RegisterUser from './pages/Register';


function App() {

  return (
    <div className="flex justify-center">

      <div className="w-[480px] z-0">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<RegisterUser />} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
}

export default App;
