"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";
import { SessionProvider, signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import SettingsModal from "@/app/mensagens/components/SettingsModal";

interface UserMenuProps {
  currentUser?: SafeUser | null;

}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);



  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
     <SettingsModal
      currentUser={currentUser}
      isOpen={settingsIsOpen}
      onClose={() => setSettingsIsOpen(false)}
     />
      <div className="relative" ref={menuRef}>
        <div className="flex flex-row items-center gap-3">
          <div
            onClick={onRent}
            className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
          >
            Anuncie sua vaga
          </div>
          <div
            onClick={toggleOpen}
            className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
          >
            <AiOutlineMenu />
            <div className="hidden md:block">
              <Avatar src={currentUser?.image} />
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute rounded-xl shadow-md w-[40vw] md:w-60 bg-white overflow-hidden right-0 top-12 text-sm">
            <div className="flex flex-col cursor-pointer">
              {currentUser ? (
                <SessionProvider>
                  <MenuItem
                    onClick={rentModal.onOpen}
                    label="Anunciar minha vaga"
                  />
                  <hr />
                  <MenuItem
                    onClick={() => router.push("/mensagens")}
                    label="Minhas mensagens"
                  />
                  <MenuItem
                    onClick={() => router.push("/favoritos")}
                    label="Meus favoritos"
                  />
                  {/* <MenuItem onClick={() => router.push('/reservas')} label="Minhas reservas" />
                <MenuItem onClick={() => router.push('/reservas-recebidas')} label="Reservas Recebidas" /> */}
                  <MenuItem
                    onClick={() => router.push("/vagas")}
                    label="Minhas vagas"
                  />
                  <MenuItem onClick={() => setSettingsIsOpen(true)} label="Perfil" />
                  <hr />
                  <MenuItem onClick={() => signOut()} label="Sair" />
                </SessionProvider>
              ) : (
                <>
                  <MenuItem onClick={loginModal.onOpen} label="Entrar" />
                  <MenuItem
                    onClick={registerModal.onOpen}
                    label="Cadastrar-se"
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserMenu;
