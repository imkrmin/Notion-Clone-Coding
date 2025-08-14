import React, { useState, useRef } from "react";
import { Menu } from "../../ui/Menu";
import { IoAdd, IoSwapHorizontal, IoTrashOutline } from "react-icons/io5";
import { RxDragHandleDots2 } from "react-icons/rx";
import type { Block } from "../../../types/block";

interface BlockActionButtonProps {
  block: Block;
  onAddBlock: (afterBlockId: string, type?: Block["type"]) => void;
  onDeleteBlock: (blockId: string) => void;
  onBlockTypeChange: (blockId: string, type: Block["type"]) => void;
  blockTypes: Array<{ type: string; label: string; icon: React.ReactNode }>;
  deleteDocument?: (documentId: string) => void;
  navigate?: (path: string) => void;
  isTypeMenuOpen?: boolean;
  onTypeMenuOpenChange?: (isOpen: boolean) => void;
}

const BlockActionButton: React.FC<BlockActionButtonProps> = ({
  block,
  onAddBlock,
  onDeleteBlock,
  onBlockTypeChange,
  blockTypes,
  deleteDocument,
  navigate,
  isTypeMenuOpen = false,
  onTypeMenuOpenChange,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const showTypeMenu = isTypeMenuOpen;
  const setShowTypeMenu = onTypeMenuOpenChange || (() => {});

  const handleTypeChange = (type: Block["type"]) => {
    if (block.content === "/" && type !== "page") {
      onAddBlock(block.id, type);
      onBlockTypeChange(block.id, "paragraph");
    } else {
      onBlockTypeChange(block.id, type);
    }

    setShowTypeMenu(false);
    setShowMenu(false);
  };

  const handleDeleteBlock = () => {
    if (block.type === "page" && block.linkedPageId && deleteDocument) {
      deleteDocument(block.linkedPageId);

      if (
        window.location.pathname === `/documents/${block.linkedPageId}` &&
        navigate
      ) {
        navigate("/");
      }

      onBlockTypeChange(block.id, "paragraph");
      setShowMenu(false);
      return;
    }

    onDeleteBlock(block.id);
    setShowMenu(false);
  };

  return (
    <div className="relative flex items-center justify-center -ml-16 transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
      <button
        onClick={() => onAddBlock(block.id)}
        className="p-1 rounded transition-colors text-[#464440] opacity-40 hover:bg-[#D3D1CB] hover:bg-opacity-30 cursor-pointer"
      >
        <IoAdd size={20} />
      </button>

      <Menu
        trigger={
          <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded transition-colors text-[#464440] opacity-40 hover:bg-[#D3D1CB] hover:bg-opacity-30 cursor-pointer"
          >
            <RxDragHandleDots2 size={18} />
          </button>
        }
        items={[
          {
            label: "전환",
            icon: <IoSwapHorizontal size={16} className="text-gray-500" />,
            onClick: () => {
              setShowTypeMenu(!showTypeMenu);
            },
            closeOnClick: false,
          },
          {
            label: "삭제",
            icon: <IoTrashOutline size={16} />,
            onClick: handleDeleteBlock,
            className: "hover:text-red-600",
          },
        ]}
        isOpen={showMenu}
        onOpenChange={setShowMenu}
        triggerOnClick={false}
        position={(() => {
          if (!buttonRef.current) return undefined;
          const rect = buttonRef.current.getBoundingClientRect();
          return {
            top: rect.top - 8,
            left: rect.left - 115,
          };
        })()}
      />

      <Menu
        trigger={<div />}
        items={blockTypes.map(type => ({
          label: type.label,
          icon: type.icon,
          onClick: () => handleTypeChange(type.type as Block["type"]),
        }))}
        isOpen={showTypeMenu}
        onOpenChange={setShowTypeMenu}
        triggerOnClick={false}
        position={(() => {
          if (!buttonRef.current) return undefined;
          const rect = buttonRef.current.getBoundingClientRect();
          return {
            top: Math.min(rect.top - 8, window.innerHeight - 360),
            left: rect.left - 115 + 125,
          };
        })()}
      />
    </div>
  );
};

export default BlockActionButton;
