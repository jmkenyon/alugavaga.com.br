"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import ChatAvatar from "./ChatAvatar";
import { User } from "@prisma/client";

interface UserBoxProps {
  data: User;
}

export const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true)

        axios.post('/api/conversations', {
            userId: data.id
        })
        .then((data) => {
            router.push(`/mensagens/${data.data.id}`)
        })
        .finally(() => setIsLoading(false))
    }, [data, router])

  return <div
  onClick={handleClick}
  className="
    w-full
    relative
    flex
    items-center
    space-x-3
    bg-white
    p-3
    hover:bg-neutral-100
    rounded-lg
    transition
    cursor-pointer
  
  "
  >
    <ChatAvatar user={data} />
    <div className="min-w-0 flex-1">
    <div className="focus:outline-none">
        <div className="
            flex
            justify-between
            items-center
            mb-1

        ">
            <p className="
                text-sm
                font-medium
                text-gray-900
            ">
                {data.name}
            </p>
        </div>

    </div>
    </div>
  </div>;
};
