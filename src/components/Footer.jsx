import React from "react";
import { assets } from "../assets/assets";
import { Instagram, Youtube, MessageCircle } from 'lucide-react';
const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} Balaji NV Collections Built with Love.
          </p>
          <div className="flex gap-6">
            <a href="https://whatsapp.com/channel/0029VaD8s2bGufJ05R0ksj2A" target="_blank" className="text-neutral-700 hover:text-black transition-colors"><MessageCircle size={28} /></a>
            <a href="https://www.youtube.com/@balajinvwholesale3614" target="_blank" className="text-neutral-700 hover:text-black transition-colors"><Youtube size={28} /></a>
            <a href="https://www.instagram.com/nv_bags_collection/?hl=en" target="_blank" className="text-neutral-700 hover:text-black transition-colors"><Instagram size={28} /></a>
          </div>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul>
            <li> Whatsapp +91 9029378333</li>
          </ul>
        </div>
        <div>
          <img src={assets.logo} className="mb-3 h-10 " alt="" />
          <p className="w-full text-gray-600">
            © 2025 BalajiNV. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
