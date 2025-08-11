"use client";

import React from "react";
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { FaBrazilianRealSign } from "react-icons/fa6";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  disabled,
  formatPrice,
  register,
  required,
  errors,
}) => {
  return (
    <div className="w-full relative">
      {formatPrice && (
        <FaBrazilianRealSign
          size={20}
          className="
                    text-neutral-700
                    absolute
                    top-7
                    left-3
                "
        />
      )}
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder={placeholder}
        type={type}
        className={`
                    peer
                    w-full
                    p-4
                    pt-6
                    font-light
                    bg-white
                    border-2
                    rounded-md
                    outline-none
                    transition
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    ${formatPrice ? "pl-9" : "pl-4"}
                    ${errors[id] ? "border-rose-500" : "border-neutral-300"}
                    ${
                      errors[id]
                        ? "focus:border-rose-500"
                        : "focus:border-black"
                    }
                    ${id === "description" ? "h-[150px]" : ""}
                    ${id === "title" ? "h-[100px]" : ""}
                `}
      />
      <label
        htmlFor={id}
        className={`
            absolute
            text-md
            duration-150
            transform
            peer-placeholder-shown:scale-100
            peer-placeholder-shown:translate-y-0
            peer-focus:scale-75
            peer-focus:-translate-y-4
            top-5
            z-10
            origin-[0]
            ${formatPrice ? "left-9" : "left-4"}
            ${errors[id] ? "text-rose-500" : "text-zinc-400"}
          `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
