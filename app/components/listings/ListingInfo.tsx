"use client";

import { SafeUser } from "@/app/types";
import Avatar from "../Avatar";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});



interface ListingInfoProps {
  user: SafeUser;
  description: string;
  category: string;
  locationValue: string;
  whatsapp: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  category,
  locationValue,
  whatsapp,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
                text-xl
                font-semibold
                flex
                flex-row
                items-center
                gap-2
            "
        >
          <div>Hospedado por {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <hr />
        {category}
        <hr />
        <div className="text-lg font-light text-neutral-500">{description}</div>
        <hr />
        <Map center={[-23.55052, -46.633308]}/>
      </div>
    </div>
  );
};

export default ListingInfo;
