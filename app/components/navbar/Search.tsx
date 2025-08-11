"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import React from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  const searchModal = useSearchModal();

  return (
    <div 
      onClick={searchModal.onOpen}
      className="border border-gray-300 w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold px-6">Buscar Vaga</div>
        <div className="hidden sm:block text-sm font-semibold px-6 border-l border-gray-300 flex-1 text-center">
          Selecionar datas
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
