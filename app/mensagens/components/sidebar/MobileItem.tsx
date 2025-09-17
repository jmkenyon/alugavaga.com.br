"use client"
import clsx from "clsx"
import Link from "next/link"
import { IconType } from "react-icons";

interface MobileItemProps {
  href: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void;

}

function MobileItem: React.FC<MobileItemProps> = ({
  href,
  icon,
  active,
  onClick
}) {
  return (
    <div>MobileItem</div>
  )
}

export default MobileItem