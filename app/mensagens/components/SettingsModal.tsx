"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ModalConversation from "../[conversationId]/components/ModalConversation";
import InputProfile from "@/app/components/inputs/InputProfile";
import { SafeUser } from "@/app/types";
import Image from "next/image";
import {
  CldUploadButton,
  type CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Button from "@/app/components/Button";

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser?: SafeUser | null;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.event !== "success") return;

    if (typeof result.info === "object" && "secure_url" in result.info) {
      const info = result.info as { secure_url: string };
      setValue("image", info.secure_url, {
        shouldValidate: true,
      });
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("../api/settings", data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Algo deu errado!"))
      .finally(() => setIsLoading(false));
  };

  return (
    <ModalConversation isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2
              className="
                            text-base
                            font-semibold
                            leading-7
                            text-gray-900
                        "
            >
              Perfil
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Editar suas informações
            </p>
            <div
              className="
                        mt-10
                        flex
                        flex-col
                        gap-y-8
                        "
            >
              <InputProfile
                disabled={isLoading}
                label="Nome"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <div>
                <label
                  className="block
                                    text-sm
                                    font-medium
                                    leading-6
                                    text-gray-900
                                "
                >
                  Imagen
                </label>
                <div
                  className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-x-3

                                "
                >
                  <Image
                    width="48"
                    height="48"
                    className="rounded-full"
                    src={
                      image || currentUser?.image || "/images/placeholder.jpg"
                    }
                    alt="Avatar"
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="alugavaga_upload_preset"
                  >
                    <div>
                      <span className="px-4 py-2 border rounded-md bg-white text-black cursor-pointer hover:bg-gray-100">
                        Alterar
                      </span>
                    </div>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>

          <div
            className="
                        mt-6
                        flex
                        items-center
                        justify-end
                        gap-x-6
                    "
          >
            <Button
              label="Cancelar"
              disabled={isLoading}
              outline
              onClick={onClose}
            />
            <Button label="Salvar" disabled={isLoading} type="submit" />
          </div>
        </div>
      </form>
    </ModalConversation>
  );
};

export default SettingsModal;
