import logo from "./logo.svg";
import "./App.css";
import Icon from "@mdi/react";

import Home from "./components/global/home";
import Navbar from "./components/global/navbar";
import { Route, Routes } from "react-router-dom";
import Registration from "./components/authentication/registration";
import Login from "./components/authentication/login";
import Footer from "./components/global/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./components/authentication/logout";
import ResetPassword from "./components/authentication/resetPassword";
import ResetPasswordConfirm from "./components/authentication/resetPasswordConfirm";

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <header>
        <Navbar />
      </header>
      <div className="flex-fill">
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/home" element={<Home></Home>}></Route>
          <Route
            path="/login"
            element={
              <div className="login-page">
                <Login></Login>
              </div>
            }
          ></Route>
          <Route
            path="/registration"
            element={
              <div className="registration-page">
                <Registration></Registration>
              </div>
            }
          ></Route>
          <Route
            path="/logout"
            element={
              <div>
                <Logout></Logout>
              </div>
            }
          ></Route>
          <Route
            path="/resetPassword"
            element={
              <div className="login-page">
                <ResetPassword></ResetPassword>
              </div>
            }
          ></Route>
          <Route
            path="/resetPassword/:token"
            element={
              <div className="login-page">
                <ResetPasswordConfirm></ResetPasswordConfirm>
              </div>
            }
          ></Route>
        </Routes>
      </div>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
}

export default App;
