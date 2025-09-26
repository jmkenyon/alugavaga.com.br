"use client";

import React from "react";
import { IconType } from "react-icons";

interface buttonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset"; // add this
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  danger?: boolean;
  secondary?: boolean;
  icon?: IconType;
}

const Button: React.FC<buttonProps> = ({
  label,
  onClick,
  type="button",
  disabled,
  outline,
  small,
  danger,
  secondary,
  icon: Icon,
}) => {
  return (
    <button
      onClick={onClick}
      type={type} 
      disabled={disabled}
      className={`
            relative
            disabled:opacity-70
            disabled:cursor-not-allowed
            rounded-lg
            hover:opacity-80
            transition
            w-full
            ${outline ? "bg-white" : "bg-[#076951]"}
            ${outline ? "border-black" : "border-[#076951]"}
            ${outline ? "text-black" : "text-white"}
            ${small ? "py-1" : "py-3"}
            ${small ? "text-sm" : "text-md"}
            ${small ? "font-light" : "font-semibold"}
            ${small ? "border-[1px]" : "border-2"}
            ${danger && "bg-red-700 border-red-700 w-32 " }
            ${secondary &&  "border-none"}
            `}
    >
      {Icon && (
        <Icon
          size={24}
          className="
                absolute
                left-4
                top-3
            "
        />
      )}
      {label}
    </button>
  );
};

export default Button;
