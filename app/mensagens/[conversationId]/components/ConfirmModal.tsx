"use client";

import { useRouter } from "next/navigation";
import useConversation from "../../hooks/useConversation";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ModalConversation from "./ModalConversation";
import { FiAlertTriangle } from "react-icons/fi";
import { DialogTitle } from "@headlessui/react";
import Button from "@/app/components/Button";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios
      .delete(`../api/conversations/${conversationId}`)
      .then(() => {
        onClose();
        router.push("/mensagens");
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);
  return (
    <ModalConversation isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div
          className="mx-auto
                flex
                h-12
                w-12
                flex-shrink-0
                items-center
                justify-center
                rounded-full
                bg-red-100
                sm:mx-0
                sm:h-10
                sm:w-10
            "
        >
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div
          className="
                mt-3
                text-center
                sm:ml-4
                sm:mt-0
                sm:text-left
            "
        >
          <DialogTitle
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Excluir conversa
          </DialogTitle>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Tem certeza de que deseja excluir esta conversa?
            </p>
          </div>
        </div>
      </div>
      <div
        className="
        mt-5
        sm:mt-4
        sm:flex
        sm:flex-row-reverse
        gap-8
      "
      >
        <Button 
        disabled={isLoading}
        danger
        label="Excluir" 
        onClick={onDelete} />
        <Button 
        disabled={isLoading}
        outline
        secondary
        label="Cancelar" 
        onClick={onClose} />
      </div>
    </ModalConversation>
  );
};

export default ConfirmModal;
