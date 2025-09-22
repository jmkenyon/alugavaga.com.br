"use client";

import useConversation from "@/app/users/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConversationBox from "./ConversationBox";
import { SessionProvider } from "next-auth/react";

interface ConversationListProps {
  initialItems: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
}) => {
  const [items, setItems] = useState(initialItems);

  const router = useRouter();

  const { conversationId, isOpen } = useConversation();

  return (
    <SessionProvider>
      <aside
        className={clsx(
          `
    fixed
    mt-20
    inset-y-0
    pb-20
    lg:w-80
    lg:block
    overflow-y-auto
    border-r
    border-gray-200
  `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div
              className="
              text-2xl
              font-bold
              text-neutral-800
            "
            >
              Mensagens
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </SessionProvider>
  );
};

export default ConversationList;
