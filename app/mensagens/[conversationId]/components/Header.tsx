"use client"

import ChatAvatar from "@/app/users/components/ChatAvatar"
import useOtherUser from "@/app/users/hooks/useOtherUser"
import { Conversation, User } from "@prisma/client"
import { SessionProvider } from "next-auth/react"
import Link from "next/link"
import { useMemo } from "react"
import { HiChevronLeft } from "react-icons/hi"
import { HiEllipsisHorizontal } from "react-icons/hi2"

interface HeaderProps {
    conversation: Conversation & {
        users: User[]
    }
}

const Header: React.FC<HeaderProps> = ({
    conversation
}) => {

    const otherUser = useOtherUser(conversation)

    const statusText = useMemo(() => {
        return 'Active'

    },[])


  return (
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
            <Link className="lg:hidden
            block
            text-[#076951]
            hover:text-[#05513E]
            transition
            cursor-pointer
            
            " href="/mensagens">
                <HiChevronLeft size={32}/>
            </Link>
            <ChatAvatar user={otherUser}/>
            <div className="flex flex-col">
                <div>
                    {otherUser.name}
                </div>
                <div className="
                    text-sm
                    font-light
                    text-neutral-500

                
                ">
                    {statusText}
                </div>
            </div>
        </div>
        <HiEllipsisHorizontal size={32} 
        onClick={() => {}}
        className="text-[#076951] cursor-pointer transition hover:text-[#05513E]"/>
    </div>
  )
}

export default Header