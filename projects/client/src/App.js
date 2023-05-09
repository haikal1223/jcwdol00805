import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import OrderDetail from "./pages/Order/OrderDetail";
import Product from "./pages/Product";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Pages from "./components/pages";
import Activation from "./pages/activation";
import RegisterUser from "./pages/Register";
import ForgotPassword from "./pages/forgotPassword";
import UpdatePassword from "./pages/newPassword";
import EditProfile from "./pages/editProfile";
import CheckOut from "./pages/CheckOut";

import AdminHome from "./pages/Admin/Home";
import AdminUser from "./pages/Admin/User";
import AdminNavbar from "./pages/Admin/components/navbar";
import ProductCategoryAdmin from "./pages/Admin/Category";
import AdminOrder from "./pages/Admin/Order";
import AdminProduct from "./pages/Admin/Product/Home";
import AdminProductDetail from "./pages/Admin/Product/Detail";
import AdminMutation from "./pages/Admin/Mutation";
import AdminDashboard from "./pages/Admin/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const navigate = useNavigate();

  const keepLoggedIn = () => {
    try {
      const token = localStorage.getItem("myToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const keepAdminLoggedIn = () => {
    try {
      const token = Cookies.get("adminToken");
      if (token) {
        setAdminLoggedIn(true);
      } else {
        setAdminLoggedIn(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    keepLoggedIn();
    keepAdminLoggedIn();
  }, []);

  const RequireAuth = ({ children }) => {
    const userIsLogged = localStorage.getItem("myToken");

    if (!userIsLogged) {
      return (
        <>
          <Navigate to="/" />
          {toast.error("Please log in first.", {
            id: "login",
            duration: 2000,
          })}
        </>
      );
    }
    return children;
  };

  const AuthAdmin = ({ children }) => {
    const adminIsLogged = Cookies.get("adminToken");

    if (!adminIsLogged) {
      return (
        <>
          <Navigate to="/admin" />
          {toast.error("Please log in first.", {
            id: "adminlogin",
            duration: 2000,
          })}
        </>
      );
    }
    return children;
  };

  const AuthMainAdmin = ({ children }) => {
    const adminRoleLogged = localStorage.getItem("role");

    if (adminRoleLogged != "admin") {
      return (
        <>
          <Navigate to="/admin" />
          {toast.error("You don't have access to this page", {
            id: "adminlogin",
            duration: 2000,
          })}
        </>
      );
    }
    return children;
  };

  const adminLogout = () => {
    return (
      <>
        {Cookies.remove("adminToken")}
        {Cookies.remove("role")}
        {setTimeout(() => {
          window.location.href = "/admin";
        }, 200)}
        {toast.success("You have been logged out", {
          id: "logout",
          duration: 3000,
        })}
      </>
    );
  };

  return (
    <div className="flex justify-center">
      <div
        className={
          window.location.pathname.includes("/admin")
            ? "w-[1440px] z-0"
            : "w-[480px] z-0"
        }
      >
        {window.location.pathname.includes("/admin") ? (
          <AdminNavbar login={adminLoggedIn} func={adminLogout} />
        ) : (
          <Navbar login={isLoggedIn} />
        )}
        <Routes>
          <Route path="/" element={<Home login={isLoggedIn} />} />
          <Route path="/activation" element={<Activation />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/product/:id" element={<Product login={isLoggedIn} />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <CheckOut />
              </RequireAuth>
            }
          />
          <Route
            path="/cart"
            element={
              <RequireAuth>
                <Cart login={isLoggedIn} />
              </RequireAuth>
            }
          />
          <Route
            path="/order"
            element={
              <RequireAuth>
                <Order login={isLoggedIn} />
              </RequireAuth>
            }
          />
          <Route
            path="/order/detail/:orderId"
            element={
              <RequireAuth>
                <OrderDetail login={isLoggedIn} />
              </RequireAuth>
            }
          />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/updatePassword/:uid" element={<UpdatePassword />} />
          {/* Admin Routing */}
          <Route path="/admin" element={<AdminHome />} />
              <Route
            path="/admin/user"
            element={
              <AuthAdmin>
                <AdminUser />
              </AuthAdmin>
            }
          />
          <Route
            path="/admin/category"
            element={
              <AuthAdmin>
                <ProductCategoryAdmin />
              </AuthAdmin>
            }
          />

            <Route 
              path='/admin/order' 
              element={
                <AuthAdmin>
                  <AdminOrder />
                </AuthAdmin>
              }
            />
            <Route 
              path='/admin/product' 
              element={
                <AuthAdmin>
                  <AdminProduct />
                </AuthAdmin>
              }
            />  
            <Route 
              path='/admin/product/:product_id' 
              element={
                <AuthAdmin>
                  <AdminProductDetail />
                </AuthAdmin>
              }
            />
            <Route 
              path='/admin/mutation' 
              element={
                <AuthAdmin>
                  <AdminMutation />
                </AuthAdmin>
              }
            />  
          <Route 
              path='/admin/dashboard' 
              element={
                <AuthAdmin>
                  <AdminDashboard />
                </AuthAdmin>
              }
            />    

        </Routes>
        {window.location.pathname.includes("/admin") ? <></> : <Footer />}
        <Toaster />
      </div>
    </div>
  );
}

export default App;
