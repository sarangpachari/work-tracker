import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser ) => {
      const uid = currentUser ?.uid;

      if (currentUser ) {
        navigate(`/dashboard/${uid}`, { replace: true });
        // Show the prompt for adding to home screen
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User  accepted the A2HS prompt');
            } else {
              console.log('User  dismissed the A2HS prompt');
            }
            setDeferredPrompt(null);
          });
        }
      } else {
        navigate("/", { replace: true });
      }
    });

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // Prevent the mini-info bar from appearing on mobile
      setDeferredPrompt(e); // Stash the event so it can be triggered later
    });

    return () => {
      unsubscribe();
      window.removeEventListener('beforeinstallprompt', (e) => {});
    };
  }, [deferredPrompt]);

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const uid = auth?.currentUser ?.uid;
      navigate(`/dashboard/${uid}`, { replace: true });
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