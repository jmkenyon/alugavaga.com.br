"use client";

import qs from "query-string";
import React, { useCallback, useMemo, useState } from "react";
import Modal from "./Modal";
import useSearchModal from "@/app/hooks/useSearchModal";
import { useRouter, useSearchParams } from "next/navigation";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import LocationSelect, { CountrySelectValue } from "../inputs/LocationSelect";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calender from "../inputs/Calender";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
}

const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();

  const searchModal = useSearchModal();
  const [location, setLocation] = useState<CountrySelectValue>();

  const [step, setStep] = useState(STEPS.LOCATION);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.DATE) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      lat: location?.latlng[0],
      lng: location?.latlng[1],
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();

    router.push(url);
  }, [step, searchModal, location, router, dateRange, onNext, params]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.DATE) {
      return "Search";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "Back";
  }, [step]);


  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading 
        title="Onde você quer estacionar?"
        subtitle="Encontre o lugar perfeito para sua vaga"
      />
      <LocationSelect 
        value={location}
        placeholder="Digite um local"
        onChange={(value) => 
          setLocation(value as CountrySelectValue)
        }
      />
      {/* <hr />
      <Map center={location?.latlng} /> */}
    </div>
  )

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8 ">
        <Heading
          title="Quando você precisa estacionar?"
          subtitle="Escolha quando vai precisar da sua vaga."
        />
        <Calender 
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    )
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filtros"
      actionLabel={actionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      secondaryActionLabel={secondaryActionLabel}
      body={bodyContent}
    />
  );
};

export default SearchModal;
