import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
  closeOnClick?: boolean;
}

interface MenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  position?: { top: number; left: number };
  className?: string;
  triggerOnClick?: boolean;
}

export const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  isOpen,
  onOpenChange,
  position,
  className = "",
  triggerOnClick = true,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenChange(!isOpen);
  };

  const handleItemClick = (item: MenuItem) => {
    item.onClick();

    if (item.closeOnClick !== false) {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onOpenChange]);

  const renderMenu = () => {
    if (!isOpen || !position) return null;

    return createPortal(
      <div
        ref={menuRef}
        className={`fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg min-w-40 ${className}`}
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(item)}
            className={`flex items-center w-full gap-3 px-3 py-2 text-sm font-normal text-center hover:bg-gray-100 ${
              item.className || ""
            }`}
          >
            {item.icon && <span className="w-6 text-center">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>,
      document.body
    );
  };

  return (
    <div className="relative">
      <div ref={triggerRef} onClick={triggerOnClick ? handleToggle : undefined}>
        {trigger}
      </div>
      {renderMenu()}
    </div>
  );
};
