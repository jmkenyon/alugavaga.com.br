// app/not-found.tsx
import EmptyState from "./components/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="Página não encontrada"
      subtitle="A vaga que você procura não existe."
    />
  );
}