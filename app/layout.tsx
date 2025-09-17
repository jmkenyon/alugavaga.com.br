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
import WhatsappButton from "./components/WhatsappButton";
import ContentWrapper from "./components/ContentWrapper";


const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aluga Vaga | Encontre Vagas de Estacionamento",
  description:
    "Alugue ou anuncie vagas de estacionamento com facilidade. Acesso seguro, preços justos e localização prática. Encontre sua vaga agora!",
  keywords: [
    "estacionamento",
    "vaga de garagem",
    "aluguel de garagem",
    "parking space rental",
    "Aluga Vaga",
    "vagas para alugar",
    "garagem para alugar",
    "reservar vaga"
  ],
  authors: [
    { name: "Aluga Vaga Team", url: "https://www.alugavaga.com.br" }
  ],
  openGraph: {
    title: "Aluga Vaga | Encontre Vagas de Estacionamento",
    description:
      "Alugue ou anuncie vagas de estacionamento com facilidade. Acesso seguro, preços justos e localização prática. Encontre sua vaga agora!",
    url: "https://www.alugavaga.com.br",
    siteName: "Aluga Vaga",
    images: [
      {
        url: "https://www.alugavaga.com.br/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Aluga Vaga - Encontre vagas de estacionamento",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
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
        <ContentWrapper>{children}</ContentWrapper>
        <WhatsappButton /> 
      </body>
    </html>
  );
}
