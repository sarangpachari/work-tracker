import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { Spinner } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";

const Signup = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });
  const [email, setEmail] = useState("");
  const [shopName, setShopName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // alert("Passwords do not match!");
      setToast({
        show: true,
        message: "Passwords do not match!",
        variant: "danger",
      });
      return;
    }

    try {
      setLoading(true);
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // Create a document with the uid using setDoc
      await setDoc(doc(db, "users", uid), {
        email: email,
        shopName: shopName,
        createdAt: serverTimestamp(),
        allPendingWorks: [],
        allAttendedWorks: [],
        allCompletedWorks: [],
      });

      // alert("Signup successful!");
      setToast({
        show: true,
        message: "Signup successful!",
        variant: "success",
      });
      await signInWithEmailAndPassword(auth, email, password);
      navigate(`/dashboard/${uid}`, { replace: true });

      // Reset form
      setEmail("");
      setShopName("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error signing up: ", error);
      // alert(error.message);
      setToast({ show: true, message: error.message, variant: "danger" });
    }
    setLoading(false);
  };
  return (
    <>
      {/* SPINNER */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="m-5">
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

          {/* SIGNUP FORM */}
          <form onSubmit={handleSignup}>
            <div className="form-floating mb-3">
              <input
                class="form-control"
                id="floatingEmail"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label for="floatingEmail">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                class="form-control"
                id="floatingShop"
                type="text"
                placeholder="Shop Name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
              <label for="floatingShop">Shop Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                class="form-control"
                id="floatingPass1"
                type="password"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label for="floatingPass1">Create Password</label>
            </div>
            <div className="form-floating mb-3">
              <input
                class="form-control"
                id="floatingPass2"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label for="floatingPass2">Confirm Password</label>
            </div>
            <button
              className="btn btn-outline-primary w-100 mb-3"
              type="submit"
            >
              Signup
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Signup;
