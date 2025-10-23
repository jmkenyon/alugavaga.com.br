"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal"; // Assuming you're using same modal component

const IncentiveModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Ganhe R$75!"
      actionLabel="Fechar"
      onSubmit={() => setIsOpen(false)}
      body={
        <div className="text-center">
          <p className="text-lg font-medium">
            Anuncie sua vaga hoje e receba <strong>R$75 via PIX!</strong>
          </p>
          <p className="my-4">
            É só nos chamar no WhatsApp quando terminar 🚀
          </p>
          <a href="https://wa.me/5511934076875" className="mt-4 text-green-700 font-semibold">
            +55 11 93407 6875
          </a>
        </div>
      }
    />
  );
};

export default IncentiveModal;