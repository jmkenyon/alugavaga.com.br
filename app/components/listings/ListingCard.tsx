"use client";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();

  const location = data.locationValue;

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

  

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/anuncio/${data.id}`)}
      className="
        col-span-1 cursor-pointer group
    "
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
                aspect-square
                w-full
                relative
                overflow-hidden
                rounded-xl
            "
        >
          <Image
            fill
            alt="Anúncio"
            src={data.imageSrc}
            className="
                    object-cover
                    h-full
                    w-full
                    group-hover:scale-110
                    transition
                "
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold">
          {street && street}, {cityState && cityState}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.title}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">R$ {price}</div>
          {!reservation && <div className="font-light">por mes</div>}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
