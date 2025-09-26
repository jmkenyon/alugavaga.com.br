import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiChat } from "react-icons/hi";
import useConversation from "./useConversation";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Mensagens",
        href: "/mensagens",
        icon: HiChat,
        active: pathname === "/mensagens" || !!conversationId,
      },
    ],
    [pathname, conversationId]
  );
  return routes;
};

export default useRoutes;
