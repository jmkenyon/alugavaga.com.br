"use client";

import { useEffect, useState } from "react";
import { SafeUser } from "@/app/types";
import Avatar from "../Avatar";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  category: string;
  locationValue: string;
  whatsapp: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  category,
  locationValue,
  whatsapp,
}) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  // Utility to clean postal code from address (Brazil format)
  function removePostalCode(address: string) {
    return address.replace(/\d{5}-\d{3}/g, "").trim();
  }

  // Remove street numbers (all digits)
  function removeStreetNumber(address: string) {
    return address.replace(/\d+/g, "").trim();
  }

  // Simplify to city,state,country (last 3 parts of comma separated)
  function simplifyToCityStateCountry(address: string) {
    const parts = address.split(",").map((p) => p.trim());
    return parts.slice(-3).join(", ");
  }

  useEffect(() => {
    async function fetchCoordinates() {
      if (!locationValue) return;

      // Prepare the progressive queries
      const queries = [
        locationValue, // Full address
        removeStreetNumber(locationValue), // No street numbers
        removePostalCode(locationValue), // No postal code
        simplifyToCityStateCountry(locationValue), // city,state,country
      ];

      for (const query of queries) {
        try {
          const encodedAddress = encodeURIComponent(query);
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;

          const res = await fetch(url, {
            headers: {
              "User-Agent": "Alugavaga/1.0 (oi@alugavaga.com)",
            },
          });

          if (!res.ok) {
            console.error("Failed to fetch coordinates:", await res.text());
            continue; // try next query
          }

          const data = await res.json();

          if (data.length > 0) {
            setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            return; // success, stop trying further queries
          } else {
            console.warn("No results for query:", query);
          }
        } catch (err) {
          console.error("Error fetching coordinates:", err);
        }
      }

      // If all queries fail:
      setCoordinates(null);
      console.warn("Could not find coordinates for any query.");
    }

    fetchCoordinates();
  }, [locationValue]);

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
            text-xl
            font-semibold
            flex
            flex-row
            items-center
            gap-2
          "
        >
          <div>Hospedado por {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <hr />
        {category}
        <hr />
        <div className="text-lg font-light text-neutral-500">{description}</div>
        <hr />
        {coordinates ? (
          <Map center={coordinates} />
        ) : (
          <div className="text-neutral-500">
            Não foi possível localizar o endereço no mapa.
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingInfo;
