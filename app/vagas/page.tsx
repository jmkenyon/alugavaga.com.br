import EmptyState from "../components/EmptyState";
import getCurrentUser from "../actions/getCurrentUser";
import PropertiesClient from "./PropertiesClient";
import getListings from "../actions/getListings";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState title="Não autorizado" subtitle="Por favor, faça login" />
    );
  }

  const listings = await getListings({
    userId: currentUser.id,
  });

  if (listings.length === 0) {
    return (
      <EmptyState
        title="Nenhuma vaga encontrada"
        subtitle="Parece que você ainda não anunciou nenhuma vaga"
      />
    );
  }

  return (
    <PropertiesClient 
        listings={listings}
        currentUser={currentUser}
    /> 
  )
};

export default PropertiesPage;