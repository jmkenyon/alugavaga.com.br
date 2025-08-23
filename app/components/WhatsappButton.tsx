"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
  const phoneNumber = "5511934076875"; // Replace with your full phone number including country code

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
      aria-label="Conversar pelo WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}