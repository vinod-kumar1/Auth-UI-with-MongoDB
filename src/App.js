import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes } from "react-router";
import { verifyUser, createUser, key, iv } from "./verify.js";
import { BrowserRouter } from "react-router";
import { useContext, createContext } from "react";

import CryptoJS from "crypto-js";
let Render = createContext(null);

function Loading() {
  return <h2>Loading the Music App...</h2>;
}

function LoginPage() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [status, setStatus] = useState(false);
  let [loading, setLoading] = useState(false);
  let [passShow, setShow] = useState(false);

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
      if (res) window.location = "/home";
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
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type={!passShow ? "password" : "text"}
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => setShow((p) => !p)}>Show pass</button>
      <button onClick={loginAction}>Login</button>
      <br />
      <a href="/signup" id="signup">
        Sign Up?
      </a>
    </div>
  );
}

function Signup() {
  let [loginDetails, setLoginDetails] = useState({
    email: `sd${Math.floor(Math.random() * 10)}@gmail.com`,
    password: `fd@@!#2r2${Math.floor(Math.random() * 10)}`,
  });
  let [loading, setLoading] = useState(false);
  let [passShow, setShow] = useState(false);

  async function signupAction() {
    try {
      setLoading(true);
      let res = await createUser(loginDetails.email, loginDetails.password);
      if (res._id) {
        alert("You've successfully registered, please login now!");
        window.location = "/";
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
    <BrowserRouter>
      <Render.Provider value={forceUpdate}>
        <Routes>
          <Route index path="/" Component={LoginPage}></Route>
          <Route path="/signup" Component={Signup} />
          <Route path="/home" Component={Home} />
        </Routes>
      </Render.Provider>
    </BrowserRouter>
  );
}

function Home() {
  let forceUpdate = useContext(Render);

  function logout() {
    localStorage.removeItem("userdetails");
    forceUpdate();
  }

  useEffect(() => {
    if (!localStorage.getItem("userdetails")) {
      alert("You've logged out, please login again");
      window.location = "/";
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
