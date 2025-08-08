import { categories } from "@/app/components/navbar/Categories";
import { SafeListing, SafeUser } from "@/app/types";
import { Reservation } from "@prisma/client";
import { useMemo } from "react";

interface ListingClientProps {
  reservations?: Reservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
}) => {
  // const category = useMemo(() => {
  //   return categories.find((item) => item.label === listing.category); /// maybe i dont have categories.find as a function in 
  //in navbar because im not utilising categoeries in the same way === maybe not needed
  // }, [listing.category]);
  return <div>hello</div>;
};

/// 5.56.15

export default ListingClient;
