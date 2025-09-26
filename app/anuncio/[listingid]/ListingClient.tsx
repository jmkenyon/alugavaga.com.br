"use client";

import Container from "@/app/components/Container";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import ListingReservation from "@/app/components/listings/ListingReservation";


interface ListingClientProps {
  reservations?: SafeReservation[];
  data: {
    name: string | null;
    id: string;
    email: string | null;
    emailVerified: string | null;
    image: string | null;
    hashedPassword: string | null;
    createdAt: string;
    updatedAt: string;
    favoriteIds: string[];
    conversationIds: string[];
    seenMessageIds: string[];
  };
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
  data
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onCreateConversatoin = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
  
    if (!data?.id) {
      console.error("No user data available");
      return;
    }
  
    setIsLoading(true);
  
    axios.post("/api/conversations", {
      userId: data.id,
    })
    .then((res) => {
      router.push(`/mensagens/${res.data.id}`);
    })
    .finally(() => setIsLoading(false));
  }, [data, router, loginModal, currentUser]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-7
            md:gap-10
            mt-6
          "
          >
            <ListingInfo
              user={listing.user}
              category={listing.category}
              description={listing.description}
              locationValue={listing.locationValue}
              whatsapp={listing.whatsapp}
            />
            <div
              className="
              order-first
              mb-10
              md:order-last
              md:col-span-3
              "
            >
              <ListingReservation
                price={listing.price}
                onSubmit={onCreateConversatoin}
                disabled={isLoading}
               
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
