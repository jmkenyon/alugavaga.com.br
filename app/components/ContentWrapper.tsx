"use client";

import { usePathname } from "next/navigation";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isMensagensPage = pathname === "/mensagens";

  return (
    <div className={isMensagensPage ? "" : "pb-20 pt-28"}>
      {children}
    </div>
  );
}