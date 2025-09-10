"use client";

import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { SafeListing, SafeUser } from "../types";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface PropertiesClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const PropertiesClient: React.FC<PropertiesClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null
  );

  // Open confirmation modal
  const openModal = (id: string) => {
    setSelectedListingId(id);
    setIsModalOpen(true);
  };

  // Close modal without deleting
  const closeModal = () => {
    setSelectedListingId(null);
    setIsModalOpen(false);
  };

  // Confirm deletion
  const onConfirmDelete = async () => {
    if (!selectedListingId) return;

    setDeletingId(selectedListingId);

    try {
      await axios.delete(`/api/listings/${selectedListingId}`);
      toast.success("Vaga excluída");
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // TypeScript now knows this is an AxiosError
        toast.error(error.response?.data?.error || "Erro ao excluir");
      } else if (error instanceof Error) {
        // Generic JS Error
        toast.error(error.message);
      } else {
        toast.error("Erro ao excluir");
      }
    } finally {
      setDeletingId("");
      closeModal();
    }
  };

  return (
    <Container>
      <Heading title="Vagas" subtitle="Lista das suas vagas" />
      <div
        className="
          mt-10
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            actionId={listing.id}
            onAction={() => openModal(listing.id)} // open modal
            disabled={deletingId === listing.id}
            actionLabel="Excluir vaga"
            currentUser={currentUser}
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-6 w-80 text-center">
            {/* Close button in top-right */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-5 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4">Tem certeza?</h2>
            <p className="mb-6">Deseja realmente excluir esta vaga?</p>
            <div className="flex justify-between gap-4">
              <button
                onClick={closeModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded hover:bg-gray-100"
              >
                Não
              </button>
              <button
                onClick={onConfirmDelete}
                className="flex-1 py-2 px-4 bg-[#076951] text-white rounded hover:bg-[#065b46]"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default PropertiesClient;
