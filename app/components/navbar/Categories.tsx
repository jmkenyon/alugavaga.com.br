"use client";

import React from "react";
import Container from "../Container";
import { GiHomeGarage } from "react-icons/gi";
import { BiCar, BiSolidCarGarage } from "react-icons/bi";
import { MdOutlineQuestionMark } from "react-icons/md";



export const categories = [
  {
    label: 'Garagem fechada',
    icon: GiHomeGarage,
    description: 'Espaço coberto e trancado, ideal para mais segurança.'
  },
  {
    label: 'Vaga coberta',
    icon: BiSolidCarGarage,
    description: 'Vaga com cobertura, protegida do sol e da chuva.'
  },
  {
    label: 'Vaga descoberta',
    icon: BiCar,
    description: 'Espaço aberto, simples e prático para estacionar.'
  },
  {
    label: 'Outra',
    icon: MdOutlineQuestionMark,
    description: 'Outro tipo de vaga que não se encaixa nas categorias anteriores.'
  }
];

const Categories = () => {
  return (
    <Container>
      <div
        className="
            pt-4
            flex
            flex-row
            items-center
            justify-between
            overflow-x-auto
         "
      ></div>
    </Container>
  );
};

export default Categories;
