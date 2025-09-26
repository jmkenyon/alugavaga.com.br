"use client";

import qs from "query-string";
import React, { useCallback, useState } from "react";
import Modal from "./Modal";
import useSearchModal from "@/app/hooks/useSearchModal";
import { useRouter, useSearchParams } from "next/navigation";
import LocationSelect, { CountrySelectValue } from "../inputs/LocationSelect";
import Heading from "../Heading";

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();

  const searchModal = useSearchModal();
  const [location, setLocation] = useState<CountrySelectValue>();

  const onSubmit = useCallback(async () => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      locationValue: location?.value ?? "",
      lat: location?.latlng[0] ?? 0,
      lng: location?.latlng[1] ?? 0,
    };

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    searchModal.onClose();

    router.push(url);
  }, [searchModal, location, router, params]);

  const bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Onde você quer estacionar?"
        subtitle="Encontre o lugar perfeito para sua vaga"
      />
      <LocationSelect
        value={location}
        placeholder="Digite um local"
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />
    </div>
  );

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filtros"
      actionLabel="Buscar"
      body={bodyContent}
    />
  );
};

export default SearchModal;
