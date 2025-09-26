"use client";

import { usePathname } from "next/navigation";
import WhatsappButton from "./WhatsappButton";

export default function ConditionalWhatsapp() {
  const pathname = usePathname();

  // Handle the case where pathname might be null
  if (!pathname) return null;

  // Hide on /mensagens and any sub-routes (like /mensagens/123)
  if (pathname.startsWith("/mensagens")) {
    return null;
  }

  return <WhatsappButton />;
}