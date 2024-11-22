import React from "react";
import { IoIosLogOut } from "react-icons/io";
import logoImg from "../assets/logo-128.png";

const Header = () => {
  return (
    <>
      <div className="bg-primary d-flex justify-content-between align-items-center px-3 py-3">
        <div className="d-flex align-items-center column-gap-4">
          <div className="">
            <h4 className="text-white">Work Tracker</h4>
            <p className="text-white">Do it on time !</p>
          </div>
        </div>
        <div className="">
          <button
            type="button"
            className="btn btn-primary d-flex gap-2 align-items-center"
          >
            <IoIosLogOut style={{ fontSize: "28px" }} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
