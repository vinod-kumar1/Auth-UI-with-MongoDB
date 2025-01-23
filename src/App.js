import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, Navigate, useNavigate } from "react-router";
import { verifyUser, createUser, key, iv } from "./verify.js";
import { useContext, createContext } from "react";

import CryptoJS from "crypto-js";
let Render = createContext(null);

function Loading() {
  return <h2>Loading the Music App...</h2>;
}

function removeUser() {
  localStorage.removeItem("userdetails");
}

function LoginPage() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [status, setStatus] = useState(false);
  let [loading, setLoading] = useState(false);
  let [passShow, setShow] = useState(false);
  let Navigate = useNavigate();

  useEffect(() => {
    let res = localStorage.getItem("userdetails");
    console.log(res);
    if (res) {
      const bytes = CryptoJS.AES.decrypt(res, "test").toString(
        CryptoJS.enc.Utf8
      );
      let details = bytes.split("::");
      console.log(details);
      setEmail(details[0]);
      setPassword(details[1]);
    }
  }, []);

  async function loginAction() {
    try {
      setLoading(true);
      let res = await verifyUser(email, password);
      if (res) Navigate("/home");
      else {
        setStatus(true);
        setTimeout(() => setStatus(false), 2000);
      }
    } catch (err) {
      alert("Please see the console for the error logs");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      {loading && <p className="loading">Loading...</p>}
      <h2>Login Page</h2>
      {status && (
        <p className="loading error-message">
          Invalid Creds, please try again!!!
        </p>
      )}
      <input
        type="email"
        placeholder="Enter your email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type={!passShow ? "password" : "text"}
        placeholder="Enter your password..."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => setShow((p) => !p)}>Show pass</button>
      <button onClick={loginAction}>Login</button>
      <br />
      <Link to={"/signup"} id="signup">
        Sign Up?
      </Link>
    </div>
  );
}

function Signup() {
  let [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  let [loading, setLoading] = useState(false);
  let [passShow, setShow] = useState(false);
  let Navigate = useNavigate();

  async function signupAction() {
    removeUser();
    try {
      setLoading(true);
      let res = await createUser(loginDetails.email, loginDetails.password);
      if (res._id) {
        alert("You've successfully registered, please login now!");
        Navigate("/");
      }
    } catch (err) {
      alert("Please see the console for the error logs");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      {loading && <p className="loading">Loading...</p>}
      <h2>Sign Up</h2>
      <input
        type="email"
        value={loginDetails.email}
        onChange={(e) =>
          setLoginDetails((p) => ({ ...loginDetails, email: e.target.value }))
        }
        placeholder="Enter your email..."
      />
      <input
        type={!passShow ? "password" : "text"}
        placeholder="Enter your password..."
        value={loginDetails.password}
        onChange={(e) =>
          setLoginDetails((p) => ({
            ...loginDetails,
            password: e.target.value,
          }))
        }
      />
      <button onClick={() => setShow((p) => !p)}>Show pass</button>
      <button onClick={signupAction}>Sign up</button>
    </div>
  );
}

function App() {
  let [update, forceUpdate] = useState(true);

  return (
    <Render.Provider value={forceUpdate}>
      <Routes>
        <Route index path="/" Component={LoginPage}></Route>
        <Route path="/signup" Component={Signup} />
        <Route path="/home" Component={Home} />
      </Routes>
    </Render.Provider>
  );
}

function Home() {
  let forceUpdate = useContext(Render);
  let Navigate = useNavigate();

  function logout() {
    localStorage.removeItem("userdetails");
    forceUpdate();
  }

  useEffect(() => {
    if (!localStorage.getItem("userdetails")) {
      alert("You've logged out, please login again");
      Navigate("/");
    }
  }, []);

  return (
    <div className="home-container">
      <h2>Welcome to the Music App</h2>
      <Link
        id="logout"
        style={{
          cursor: "pointer",
          color: "white",
          backgroundColor: "transparent",
        }}
        to={"/"}
        onClick={logout}
      >
        Logout
      </Link>
    </div>
  );
}

export default App;
