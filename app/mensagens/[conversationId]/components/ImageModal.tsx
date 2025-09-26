"use client"

import Image from "next/image"
import ModalConversation from "./ModalConversation"

interface ImageModalProps {
    isOpen?: boolean
    onClose: () => void
    src?: string | null
}
const ImageModal: React.FC<ImageModalProps> = ({
    isOpen,
    onClose,
    src
}) => {
    if (!src) {
        return null
    }
  return (
<ModalConversation isOpen={isOpen} onClose={onClose}>
  <div className="flex items-center justify-center">
    <Image 
      alt="Imagen"
      className="object-cover"
      width={288}  
      height={288}  
      src={src}
    />
  </div>
</ModalConversation>
  )
}

export default ImageModal