import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import EmptyState from "@/app/components/EmptyState";
import React from "react";
import ListingClient from "@/app/anuncio/[listingid]/ListingClient";

interface IParams {
  listingid?: string;
}

const ListingPage = async ({ params }: { params: Promise<IParams> }) => {
  const resolvedParams = await params;

  const listing = await getListingById({ listingId: resolvedParams.listingid });
  const currentUser = await getCurrentUser();

  if (!listing) {
    return <EmptyState />;
  }

  return <ListingClient data={listing.user} listing={listing} currentUser={currentUser} />;
};

export default ListingPage;
