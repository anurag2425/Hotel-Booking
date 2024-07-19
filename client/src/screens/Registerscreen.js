import React, { useState, useLayoutEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function Registerscreen() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);
  const [success, setsuccess] = useState(false);

  async function register() {
    if (password === cpassword) {
      const user = {
        name,
        email,
        password,
      };
      try {
        setLoading(true);
        seterror(null);
        const result = await axios.post("/api/users/regi", user);
        console.log(result.data);
        setLoading(false);
        setsuccess(true);

        setname("");
        setemail("");
        setpassword("");
        setcpassword("");
      } catch (error) {
        console.log(error);
        setLoading(false);
        seterror(error.response?.data?.error || "Registration failed");
      }
    } else {
      alert("Passwords do not match");
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
      {error && <Error message={error} />}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {success && <Success message="Registration successful" />}
          <div className="bs">
            <h2>Register</h2>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => setcpassword(e.target.value)}
            />
            <button className="btn btn-primary mt-3" onClick={register}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registerscreen;
