import React, { useEffect, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const Header = () => {
  const [user, setUser ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser ) => {
      if (currentUser ) {
        setUser (true);
      } else {
        setUser (false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    try {
      let result = confirm("Are you sure to Logout ?");
      if (result === true) {
        await signOut(auth);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-primary d-flex justify-content-between align-items-center px-3 py-3 shadow-lg">
        <div className="d-flex align-items-center column-gap-4">
          <div className="">
            <h4 className="text-white">Work Tracker</h4>
            <p className="text-white">Do it on time!</p>
          </div>
        </div>
        <div className="">
          {user && (
            <button
              onClick={(e) => logout(e)}
              type="button"
              className="btn btn-primary d-flex gap-2 align-items-center"
            >
              <IoIosLogOut style={{ fontSize: "28px" }} />
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;