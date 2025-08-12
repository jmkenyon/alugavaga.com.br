"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import { differenceInCalendarDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const locationValue = params?.get("locationValue");
  const startDate = params?.get("startDate");
  const endDate = params?.get("endDate");

  const locationLabel = useMemo(() => {
    if (locationValue) {
      const location = locationValue;

      const parts = location.split(",").map((part) => part.trim());

      const street = parts[0].replace(/\d+/g, "").trim();
      const neighbourhood = parts.length > 1 ? parts[1] : "";
      const cityStateIndex = parts.findIndex((part) => part.includes(" - "));

      // City and state part
      let cityState = cityStateIndex >= 0 ? parts[cityStateIndex] : "";

      const normalize = (str: string) =>
        str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .trim();

      if (cityState.includes(" - ")) {
        const [left, right] = cityState.split(" - ").map((p) => p.trim());
        if (normalize(left) === normalize(right)) {
          cityState = left; // keep only one
        }
      }

      // fallback chain: street → neighbourhood → cityState
      const primaryLocation = street || neighbourhood || cityState;

      return primaryLocation;
    }
    return "Buscar Vaga";
  }, [locationValue]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      let diff = differenceInCalendarDays(end, start);

      if (diff === 0) {
        diff = 1;
      }

      return `${diff} Dias`;
    }

    return "Selecionar datas";
  }, [startDate, endDate]);

  return (
    <div
      onClick={searchModal.onOpen}
      className="border border-gray-300 w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold px-6">{locationLabel}</div>
        <div className="hidden sm:block text-sm font-semibold px-6 border-l border-gray-300 flex-1 text-center">
          {durationLabel}
        </div>
        <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
          <div
            className="p-2 bg-[#076951] rounded-full text-white"
            title="Buscar"
            aria-label="Buscar"
          >
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
