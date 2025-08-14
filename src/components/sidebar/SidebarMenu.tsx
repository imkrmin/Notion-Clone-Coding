import React from "react";

type MenuVariant = "home" | "search" | "trash" | "default";

interface SidebarMenuProps {
  icon: React.ReactNode;
  label: string;
  variant?: MenuVariant;
  onClick?: () => void;
  onSearchClick?: () => void;
  onTrashClick?: () => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  icon,
  label,
  variant = "default",
  onClick,
  onSearchClick,
  onTrashClick,
}) => {
  const handleClick = () => {
    switch (variant) {
      case "home":
        onClick?.();
        break;
      case "search":
        onSearchClick?.();
        break;
      case "trash":
        onTrashClick?.();
        break;
      default:
        onClick?.();
        break;
    }
  };

  return (
    <button
      type="button"
      className="flex items-center w-full gap-2 text-[#5f5e5b] text-base font-medium px-1 py-1 hover:bg-[#D3D1CB] hover:bg-opacity-20 rounded-md cursor-pointer"
      onClick={handleClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
