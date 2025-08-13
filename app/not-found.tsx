"use client";

import { Suspense } from "react";
import EmptyState from "./components/EmptyState";

export default function NotFound() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EmptyState
        title="Página não encontrada"
        subtitle="A página que você procura não existe."
      />
    </Suspense>
  );
}