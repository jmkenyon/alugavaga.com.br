"use client";

import Button from "../Button";

interface ListingReservationProps {
  price: number;
  disabled?: boolean;
  onSubmit: () => void;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
onSubmit,
  disabled,
}) => {


  return <div
    className="
        bg-white
        rounded-xl
        border-[1px]
        border-neutral-200
        overflow-hidden
    "
  >
    <div className="
        flex
        flex-row
        items-center
        gap-1
        p-4
    ">
        <div className="text-2xl font-semibold">
            R${price}
        </div>
        <div className="font-light text-neutral-600">
            por mês

        </div>
    </div>
    <hr/>

    <hr/> 
    <div className="p-4">
        <Button 
            disabled={disabled}
            label={disabled ? "Carregando..." : "Mandar mensagem"}
            onClick={onSubmit}
            
        />
    </div>

  </div>;
};

export default ListingReservation;
