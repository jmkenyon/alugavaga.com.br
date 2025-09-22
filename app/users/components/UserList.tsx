"use client";

import { UserBox } from "./UserBox";
import { User } from "@prisma/client";

interface UserListProps {
  items: User[];
}

export const UserList: React.FC<UserListProps> = ({ items }) => {
  return (
    <aside
      className="
        mt-20
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-gray-200
        block
        w-full
        left-0
    "
    >
      <div className="px-5">
        <div className="flex-col">
            <div
            className="
                text-2xl
                font-bold
                text-neutral-800
                py-4
            "
            >Usuários

            </div>
        </div>
        {items.map((item) => (
            <UserBox
            key={item.id}
            data={item}
            />
        ))}
      </div>
    </aside>
  );
};
