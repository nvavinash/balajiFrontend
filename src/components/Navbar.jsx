import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-5 font-medium">
      <img src={assets.logo} className="w-36" alt={assets.logo} />{" "}
      <ul>
       <NavLink>
        
       </NavLink>
      </ul>
    </div>
  );
};

export default Navbar;
