import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* <div>
          <hr />
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy</li>
          </ul>
        </div> */}

        <div>
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul>
            <li> Whatsapp +91 9029378333</li>
            <li>contact_balajicollection@gmail.com</li>
          </ul>
        </div>
        <div>
          <img src={assets.logo} className="mb-5 h-5 " alt="" />
          <p className="w-full text-gray-600">
            © 2025 BalajiNV. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
