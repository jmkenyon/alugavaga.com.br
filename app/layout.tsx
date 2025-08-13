import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import RentModal from "./components/modals/RentModal";
import ToasterProvider from "./providers/ToasterProvider";
import getCurrentUser from "./actions/getCurrentUser";
import SearchModal from "./components/modals/SearchModal";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aluga Vaga | Encontre Vagas de Estacionamento",
  description:
    "Alugue ou anuncie vagas de estacionamento com facilidade. Acesso seguro, preços justos e localização prática. Encontre sua vaga agora!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ToasterProvider />
        <Suspense fallback={<div>Carregando...</div>}>
          <SearchModal />
          <Navbar currentUser={currentUser} />
        </Suspense>
        <RentModal />
        <RegisterModal />
        <LoginModal />
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
