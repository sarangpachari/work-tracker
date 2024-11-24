import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const uid = currentUser?.uid;

      if (currentUser) {
        navigate(`/dashboard/${uid}`);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const uid = auth?.currentUser?.uid;
      console.log();

      navigate(`/dashboard/${uid}`);
    } catch (error) {
      alert("Invalid Email/Password");
      console.error("Login failed:", error.message);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center my-5">
        <div style={{ maxWidth: "28rem" }} className="shadow p-4">
          <div className="form-floating">
            <input
              type="email"
              className="form-control mt-3"
              id="floatingInput"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control mt-3"
              placeholder="Password"
              id="floatingPass"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPass">Password</label>
          </div>
          <button className="btn btn-primary w-100 mt-3" onClick={signIn}>
            Login
          </button>

          <Link
            style={{ textDecoration: "none" }}
            className="btn btn-info w-100 my-3"
            to={"/signup"}
          >
            Create Account
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
