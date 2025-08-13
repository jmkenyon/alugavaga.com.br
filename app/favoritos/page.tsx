import { Suspense } from "react";
import EmptyState from "../components/EmptyState";
import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings";
import FavoritesClient from "./FavoritesClient";

const ListingPage = async () => {
  const listings = await getFavoriteListings();
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <EmptyState
        title="Ainda sem favoritos"
        subtitle="Parece que você ainda não adicionou favoritos. Comece a explorar e salve os que gostar!"
      />
    );
  }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <FavoritesClient listings={listings} currentUser={currentUser} />
    </Suspense>
  );
};

export default ListingPage;
