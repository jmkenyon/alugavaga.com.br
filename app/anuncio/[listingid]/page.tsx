import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import EmptyState from "@/app/components/EmptyState";
import React from "react";
import ListingClient from "@/app/anuncio/[listingid]/ListingClient";

interface IParams {
  listingid?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById({ listingId: params.listingid });
  const currentUser = await getCurrentUser();

  if (!listing) {
    return <EmptyState />;
  }

  return (
    <div>
      <ListingClient listing={listing} currentUser={currentUser} />
    </div>
  );
};

export default ListingPage;
