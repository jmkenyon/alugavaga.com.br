"use client";

import React from "react";
import Image from "next/image";
import { User } from "@prisma/client";
import useActiveList from "@/app/hooks/useActiveList";

interface ChatAvatarProps {
  size?: number;
  user?: User;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ size = 36, user }) => {
  const { members } = useActiveList();
  const isActive = user?.email && members.indexOf(user.email) !== -1 


  return (
    <>
      <div className="relative inline-block">
        <div
          className="
          relative
          rounded-full
          overflow-hidden
        "
          style={{ width: size, height: size }}
        >
          <Image
            src={user?.image || "/images/placeholder.jpg"}
            alt="Foto de perfil"
            width={size}
            height={size}
            className="rounded-full object-cover"
            loading="lazy"
          />
        </div>

        {isActive && (
          <span
            className="
          absolute
          rounded-full
          bg-green-500
          ring-2
          ring-white
          top-0
          right-0
          transform translate-x-1/4 -translate-y-1/4
          h-2
          w-2
          md:h-3
          md:w-3
        "
          />
        )}
      </div>
    </>
  );
};

export default ChatAvatar;
