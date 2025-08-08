"use client";

import { useRouter } from "next/navigation";
import Heading from "./Heading";
import Button from "./Button";

interface EmptyState {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyState> = ({
  title = "Nenhuma vaga encontrada",
  subtitle = "Altere ou remova alguns filtros para encontrar mais vagas disponíveis",
  showReset,
}) => {
  const router = useRouter();

  return (
    <div
      className="
        h-[60vh]
        flex
        flex-col
        gap-2
        justify-center
        items-center
    "
    >
      <Heading 
        title={title}
        subtitle={subtitle}
        center
      />
      <div className="w-48 mt-4">
        {showReset && (
            <Button
                outline
                label="Limpar filtros"
                onClick={() => router.push('/')}
            />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
