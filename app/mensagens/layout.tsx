import React from "react";
import Sidebar from "./components/sidebar/Sidebar";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div>{children}</div>
    </Sidebar>
  );
}
