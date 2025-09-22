"use client";

import { usePathname } from "next/navigation";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ""; // ✅ fallback to empty string

  const isMensagensPage = pathname === "/mensagens";
  const isMensagensDetailPage = pathname.startsWith("/mensagens/"); // ✅ no TS error now
  const isUsersPage = pathname === "/users";

  return (
    <div
      className={
        isMensagensPage || isUsersPage
          ? ""
          : isMensagensDetailPage
          ? "pt-24 h-full"
          : "pb-20 pt-28"
      }
    >
      {children}
    </div>
  );
}