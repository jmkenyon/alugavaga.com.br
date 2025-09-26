"use client";

import ChatAvatar from "@/app/mensagens/components/ChatAvatar";
import useOtherUser from "@/app/mensagens/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {members} = useActiveList()
  const isActive = otherUser?.email && members.indexOf(otherUser.email) !== -1 


  const statusText = useMemo(() => {
    return isActive ? "Ativo" : "Offline"
  }, [isActive]);

  return (
    <>
    <ProfileDrawer
      data={conversation}
      isOpen={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    />
      <div
        className="
            bg-white
            w-full
            flex
            border-b-[1px]
            sm:px-4
            py-3
            px-4
            lg:px-6
            justify-between
            items-center
            shadow-sm

        "
      >
        <div className="flex gap-3 items-center ">
          <Link
            className="lg:hidden
            block
            text-[#076951]
            hover:text-[#05513E]
            transition
            cursor-pointer
            
            "
            href="/mensagens"
          >
            <HiChevronLeft size={32} />
          </Link>
          <ChatAvatar user={otherUser} />
          <div className="flex flex-col">
            <div>{otherUser.name}</div>
            <div
              className="
                    text-sm
                    font-light
                    text-neutral-500

                
                "
            >
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="text-[#076951] cursor-pointer transition hover:text-[#05513E]"
        />
      </div>
    </>
  );
};

export default Header;
