"use client";
import useConversation from "@/app/mensagens/hooks/useConversation";
import axios from "axios";
import {FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { CldUploadButton, type CloudinaryUploadWidgetResults } from "next-cloudinary";

const Form = () => {
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("../api/messages", {
      ...data,
      conversationId: conversationId,
    });
  };

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.event !== "success") return;
  
    if (typeof result.info === "object" && "secure_url" in result.info) {
      const info = result.info as { secure_url: string };
  
      axios.post("../api/messages", {
        image: info.secure_url,
        conversationId,
      });
    }
  };

  return (
    <div
      className="
        py-4
        px-4
        bg-white
        border-t
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
    "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        uploadPreset="alugavaga_upload_preset"
        onSuccess={handleUpload}
      >
        <HiPhoto size={30} className="text-[#076951]" />
      </CldUploadButton>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Digite uma mensagem"
        />
        <button
          type="submit"
          className="
                    rounded-full
                    p-2
                    bg-[#076951]
                    cursor-pointer
                    hover:bg-[#05513E]
                    transition
                "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
