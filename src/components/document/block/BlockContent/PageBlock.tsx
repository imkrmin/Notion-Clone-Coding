import React from "react";
import type { Block } from "../../../../types/block";
import { useNavigate } from "react-router-dom";
import { useDocumentStore } from "../../../../stores/documentStore";
import { IoDocumentTextOutline } from "react-icons/io5";

interface PageBlockProps {
  block: Block;
  onCreatePage?: (blockId: string, title: string) => void;
}

export const PageBlock: React.FC<PageBlockProps> = ({
  block,
  onCreatePage,
}) => {
  const navigate = useNavigate();
  const { getDocumentById } = useDocumentStore();

  const linkedDocument = block.linkedPageId
    ? getDocumentById(block.linkedPageId)
    : null;

  const displayTitle = linkedDocument?.title || block.content || "새 페이지";
  const displayIcon = linkedDocument?.icon || block.icon;

  const handlePageClick = () => {
    if (block.linkedPageId) {
      navigate(`/documents/${block.linkedPageId}`);
    } else if (onCreatePage && !block.linkedPageId) {
      const pageTitle = block.content || "새 페이지";
      onCreatePage(block.id, pageTitle);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePageClick}
        className="flex items-center justify-center gap-1 transition-colors cursor-pointer"
      >
        {displayIcon ? (
          <span className="text-lg">{displayIcon}</span>
        ) : (
          <IoDocumentTextOutline size={18} className="text-[#5f5e5b]" />
        )}
        <span className="text-md font-semibold text-[#32302c] underline underline-offset-2 decoration-[#ebebea]">
          {displayTitle}
        </span>
      </button>
    </div>
  );
};
