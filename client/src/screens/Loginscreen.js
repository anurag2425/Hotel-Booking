import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

function Loginscreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function Login() {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    const user = { email, password };
    try {
      setLoading(true);
      setError("");
      const result = (await axios.post("/api/users/login", user)).data;
      setLoading(false);
      localStorage.setItem("currentUser", JSON.stringify(result));
      window.location.href = "/home";
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setLoading(false);
      setError(error.response ? error.response.data.message : 'An error occurred');
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <div>
      {loading && <Loader />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {error && <Error message={error} />}
          <div className="bs">
            <h2>Login</h2>
            <input
              type="text"
              className="form-control"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary mt-3" onClick={Login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginscreen;
