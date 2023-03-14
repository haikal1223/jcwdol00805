import "./App.css";
import { Route, Routes } from "react-router-dom";
import EditProfile from "./pages/editProfile";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
  return (
    <div className="flex justify-center">
      <div className="w-[480px] z-0">
        {/* <Navbar /> */}
        <Routes>
          {/* <Route path="/activation" element={<Activation />} /> */}
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
        {/* <Footer/> */}
      </div>
    </div>
  );
}

export default App;
