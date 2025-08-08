"use client";
import { SafeUser } from "@/app/types";
import React from "react";
import Image from "next/image";
import Heading from "../Heading";
import HeartButton from "../HeartButton";

interface ListingHeadProps {
  title: string;
  locationValue: string;
  imageSrc: string;
  id: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  imageSrc,
  id,
  currentUser,
}) => {
  const location = locationValue;
  const parts = location.split(",").map((part) => part.trim());

  const street = parts[0].replace(/\d+/g, "").trim();
  const cityStateIndex = parts.findIndex((part) => part.includes(" - "));

  // City and state part
  let cityState = cityStateIndex >= 0 ? parts[cityStateIndex] : "";

  const normalize = (str: string) =>
    str
      .normalize("NFD") // separate letters from accents
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .toLowerCase()
      .trim();

  if (cityState.includes(" - ")) {
    const [left, right] = cityState.split(" - ").map((p) => p.trim());
    if (normalize(left) === normalize(right)) {
      cityState = left; // keep only one
    }
  }

  let neighbourhood = "";
  if (cityStateIndex > 1) {
    neighbourhood = parts.slice(1, cityStateIndex).join(", ").trim();
  }

  const cepMatch = locationValue.match(/\b\d{5}-\d{3}\b/);
  const postcode = cepMatch ? cepMatch[0] : undefined;

  return (
    <>
      <Heading
        title={title}
        subtitle={`${street && street}, ${
          neighbourhood && neighbourhood + ", "
        }${cityState && cityState}, ${postcode && postcode}`}
      />
      <div
        className="
            w-full
            h-[60vh]
            overflow-hidden
            rounded-xl
            relative
        "
      >
        <Image 
            alt="Imagem"
            src={imageSrc}
            fill
            className="object-cover w-full"
        />
        <div className="absolute top-5 right-5">
            <HeartButton
                listingId={id}
                currentUser={currentUser}
            />
        </div>
      </div>
    </>
  );
};

export default ListingHead;
