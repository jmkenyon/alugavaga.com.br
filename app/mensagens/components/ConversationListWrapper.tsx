"use client";

import { SessionProvider } from "next-auth/react";
import ConversationList from "./ConversationList";
import { FullConversationType } from "@/app/types";

interface Props {
  initialItems: FullConversationType[];
}

export default function ConversationListWrapper({ initialItems }: Props) {
  return (
    <SessionProvider>
      <ConversationList initialItems={initialItems} />
    </SessionProvider>
  );
}