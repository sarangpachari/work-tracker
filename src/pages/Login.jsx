import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { Spinner } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const uid = currentUser?.uid;

      if (currentUser) {
        setToast({ show: true, message: "Welcome back !", variant: "success" });
        navigate(`/dashboard/${uid}`, { replace: true });
        setLoading(false);
      } else {
        navigate("/");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const uid = auth?.currentUser?.uid;
      setToast({
        show: true,
        message: "Login successfully!",
        variant: "success",
      });
      navigate(`/dashboard/${uid}`, { replace: true });
    } catch (error) {
      // alert("Invalid Email/Password");
      setToast({
        show: true,
        message: "Invalid Email/Password",
        variant: "danger",
      });
      console.error("Login failed:", error.message);
    }
  };

  return (
    <>
      {/* SPINNER */}
      {loading ? (
        <div
          style={{ height: "100px" }}
          className="d-flex justify-content-center align-items-center m-5"
        >
          <Spinner animation="grow" size="sm" variant="dark" />
          <Spinner animation="grow" variant="dark" />
          <Spinner animation="grow" size="sm" variant="dark" />
        </div>
      ):(
      <div className="d-flex justify-content-center align-items-center my-5">
        {/* Toast Container */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            onClose={() => setToast({ ...toast, show: false })}
            show={toast.show}
            delay={3000}
            autohide
            bg={toast.variant === "success" ? "success" : "danger"}
          >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>

        {/* LOGIN FORM */}
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
      )}
    </>
  );
};

export default Login;
