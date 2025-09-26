"use client";

import clsx from "clsx";
import useConversation from "./hooks/useConversation";
import EmptyStateMessenger from "./components/EmptyStateMessenger";

const Page = () => {
  const { isOpen } = useConversation();
  return (
    <div
      className={clsx(
        "lg:pl-80 h-full lg:block mt-22",
        isOpen ? "block" : "hidden"
      )}
    >
      <EmptyStateMessenger />
    </div>
  );
};

export default Page;
