import React from 'react'
import { MessageCircle, Youtube, Instagram } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-2xl p-8">

        {/* LEFT CARD */}
        <div className="flex flex-col justify-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Balaji NV Wholesale</h2>
            <p className="text-gray-600 mb-6">
              Connect with us on social platforms for latest updates,
              wholesale deals, and new collections.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-6">
              <a
                href="https://whatsapp.com/channel/0029VaD8s2bGufJ05R0ksj2A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-black transition-colors"
              >
                <MessageCircle size={28} />
              </a>

              <a
                href="https://www.youtube.com/@balajinvwholesale3614"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-black transition-colors"
              >
                <Youtube size={28} />
              </a>

              <a
                href="https://www.instagram.com/nv_bags_collection/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-black transition-colors"
              >
                <Instagram size={28} />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-gray-100 rounded-xl p-6">
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul className="space-y-3 text-gray-700">
            <li>
              📱 <span className="font-medium">WhatsApp:</span> +91 9029378333
            </li>
            <li>
              📍 <span className="font-medium">Business:</span> Wholesale Bags
            </li>
            <li>
              ⏰ <span className="font-medium">Working Hours:</span> 10 AM – 8 PM
            </li>
          </ul>
        </div>

      </div>
    </div>

  )
}

export default Contact