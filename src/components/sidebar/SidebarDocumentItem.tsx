import React, { useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Document } from "../../types/document";
import { useDocumentActions } from "../../hooks/useDocumentActions";
import { useDocumentStore } from "../../stores/documentStore";
import { Menu } from "../ui/Menu";
import { GoChevronDown, GoChevronRight, GoPlus, GoTrash } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";

interface DocumentItemProps {
  item: Document;
  level?: number;
  expandedItems: Set<string>;
  isSelected: boolean;
  selectedDocumentId?: string;
  onToggleFolder: (folderId: string) => void;
  onSelectDocument: (documentId: string) => void;
}

export const SidebarDocumentItem: React.FC<DocumentItemProps> = ({
  item,
  level = 0,
  expandedItems,
  isSelected,
  selectedDocumentId,
  onToggleFolder,
  onSelectDocument,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isExpanded = expandedItems.has(item.id);
  const { createSubPage, deletePageAndNavigate } = useDocumentActions();
  const { getDocumentById, getChildDocuments } = useDocumentStore();
  const currentItem = getDocumentById(item.id) || item;
  const childDocuments = getChildDocuments(item.id);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    onSelectDocument(item.id);
    navigate(`/documents/${item.id}`);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFolder(item.id);
  };

  const handleDeletePage = useCallback(() => {
    deletePageAndNavigate(currentItem.id);
    setIsMenuOpen(false);
  }, [currentItem.id, deletePageAndNavigate]);

  const handleAddSubPage = useCallback(() => {
    const newSubPage = createSubPage(currentItem.id, "새 페이지");
    navigate(`/documents/${newSubPage.id}`);
    setIsMenuOpen(false);
  }, [currentItem.id, createSubPage, navigate]);

  const menuItems = useMemo(
    () => [
      {
        label: "하위 페이지 추가",
        icon: <GoPlus size={14} />,
        onClick: handleAddSubPage,
      },
      {
        label: "페이지 삭제",
        icon: <GoTrash size={14} />,
        onClick: handleDeletePage,
        className: "hover:text-red-600",
      },
    ],
    [handleAddSubPage, handleDeletePage]
  );

  return (
    <div className="select-none">
      <div
        className={`group flex items-center gap-1 py-1 text-sm cursor-pointer rounded-md transition-colors hover:bg-[#D3D1CB] hover:bg-opacity-20 ${
          isSelected ? "bg-[#D3D1CB] bg-opacity-20" : "text-[#5f5e5b]"
        }`}
        style={{ paddingLeft: `${level * 16 + 5}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-center w-6 h-6">
          {childDocuments.length > 0 && isHovered ? (
            <button
              onClick={handleExpandClick}
              className="p-1 transition-all duration-200 rounded hover:bg-gray-200"
            >
              {isExpanded ? (
                <GoChevronDown size={16} className="text-[#5f5e5b]" />
              ) : (
                <GoChevronRight size={16} className="text-[#5f5e5b]" />
              )}
            </button>
          ) : currentItem.icon ? (
            <span className="text-lg leading-none">{currentItem.icon}</span>
          ) : (
            <IoDocumentTextOutline
              name="document"
              size={16}
              className="text-[#5f5e5b]"
            />
          )}
        </div>
        <span className="flex-1 truncate">
          {currentItem.title.trim() === "" ? "새 페이지" : currentItem.title}
        </span>

        <div className="relative">
          <Menu
            trigger={
              <button
                ref={buttonRef}
                onClick={e => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`flex items-center justify-center w-6 h-6 p-1 mr-1 transition-all duration-200 rounded-md hover:bg-gray-200 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                title="메뉴"
              >
                <IoIosMore size={14} className="text-[#5f5e5b]" />
              </button>
            }
            items={menuItems}
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            triggerOnClick={false}
            position={(() => {
              if (!buttonRef.current) return undefined;
              const rect = buttonRef.current.getBoundingClientRect();
              return {
                top: rect.bottom - 25,
                left: rect.right + 10,
              };
            })()}
          />
        </div>
      </div>

      {childDocuments.length > 0 && isExpanded && (
        <div>
          {childDocuments.map(child => (
            <SidebarDocumentItem
              key={child.id}
              item={child}
              level={level + 1}
              expandedItems={expandedItems}
              isSelected={selectedDocumentId === child.id}
              onToggleFolder={onToggleFolder}
              onSelectDocument={onSelectDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
};
