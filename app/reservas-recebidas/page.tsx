import EmptyState from "../components/EmptyState";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";

const ReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState title="Não autorizado" subtitle="Por favor, faça login" />
    );
  }

  const reservations = await getReservations({
    authorId: currentUser.id,
  });

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="Nenhuma reserva encontrada"
        subtitle="Parece que você não tem reservas nas suas vagas"
      />
    );
  }

  return (
    <ReservationsClient
        reservations={reservations}
        currentUser={currentUser}
    />
  )
};

export default ReservationsPage;
