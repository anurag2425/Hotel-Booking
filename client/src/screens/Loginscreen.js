import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";

function Loginscreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function Login() {
    const user = {
      email,
      password,
    };
    try {
      setLoading(true);
      setError(false);
      const result = (await axios.post("/api/users/login", user)).data;
      setLoading(false);
      localStorage.setItem("currentUser", JSON.stringify(result));
      window.location.href = "/home";
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  }

  useLayoutEffect(() => {
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
