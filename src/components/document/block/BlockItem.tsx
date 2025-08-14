import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Block } from "../../../types/block";
import { useDocumentStore } from "../../../stores/documentStore";
import BlockActionButton from "./BlockActionButton";
import {
  BulletedListBlock,
  CheckboxBlock,
  DividerBlock,
  NumberedListBlock,
  TextBlock,
  PageBlock,
} from "./BlockContent";

interface BlockItemProps {
  block: Block;
  blocks: Block[];
  onAddBlock: (afterBlockId: string, type?: Block["type"]) => void;
  onDeleteBlock: (blockId: string) => void;
  onBlockChange: (blockId: string, content: string) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    blockId: string
  ) => void;
  onBlockTypeChange: (blockId: string, type: Block["type"]) => void;
  updateBlockInDocument: (
    documentId: string,
    blockId: string,
    updates: Partial<Block>
  ) => void;
  documentId: string;
  blockTypes: Array<{ type: string; label: string; icon: React.ReactNode }>;
  deleteDocument?: (documentId: string) => void;
}

export const BlockItem: React.FC<BlockItemProps> = ({
  block,
  blocks,
  onAddBlock,
  onDeleteBlock,
  onBlockChange,
  onKeyDown,
  onBlockTypeChange,
  updateBlockInDocument,
  documentId,
  blockTypes,
  deleteDocument,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const navigate = useNavigate();
  const { createDocument } = useDocumentStore();

  const handleCreatePage = useCallback(
    (blockId: string, title: string) => {
      if (block.linkedPageId) {
        navigate(`/documents/${block.linkedPageId}`);
        return;
      }
      const newPage = createDocument(title, documentId);

      updateBlockInDocument(documentId, blockId, {
        linkedPageId: newPage.id,
        content: title,
      });

      navigate(`/documents/${newPage.id}`);
    },
    [
      createDocument,
      documentId,
      updateBlockInDocument,
      navigate,
      block.linkedPageId,
    ]
  );

  const getPlaceholder = () => {
    if (block.type === "paragraph") {
      return isFocused ? "명령어 사용 시에는 '/'를 누르세요." : "";
    }
    if (block.type === "heading1") return "제목1";
    if (block.type === "heading2") return "제목2";
    if (block.type === "heading3") return "제목3";
    if (block.type === "bulleted_list") return "리스트";
    if (block.type === "numbered_list") return "리스트";
    if (block.type === "checkbox") return "할 일";

    return "";
  };

  const renderBlockContent = () => {
    const commonProps = {
      onBlockChange,
      onKeyDown,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      placeholder: getPlaceholder(),
      onSlashInput: (_blockId: string) => setShowTypeMenu(true), // eslint-disable-line @typescript-eslint/no-unused-vars
    };

    switch (block.type) {
      case "divider":
        return <DividerBlock />;

      case "checkbox":
        return (
          <CheckboxBlock
            block={block}
            {...commonProps}
            updateBlockInDocument={updateBlockInDocument}
            documentId={documentId}
          />
        );

      case "bulleted_list":
        return <BulletedListBlock block={block} {...commonProps} />;

      case "numbered_list":
        return (
          <NumberedListBlock block={block} blocks={blocks} {...commonProps} />
        );

      case "page":
        return <PageBlock block={block} onCreatePage={handleCreatePage} />;

      case "heading1":
      case "heading2":
      case "heading3":
      case "paragraph":
      default:
        return <TextBlock block={block} {...commonProps} />;
    }
  };

  return (
    <div className="relative w-full group" data-block-id={block.id}>
      <div className="flex justify-center gap-2">
        <BlockActionButton
          block={block}
          onAddBlock={onAddBlock}
          onDeleteBlock={onDeleteBlock}
          onBlockTypeChange={onBlockTypeChange}
          blockTypes={blockTypes}
          deleteDocument={deleteDocument}
          navigate={navigate}
          isTypeMenuOpen={showTypeMenu}
          onTypeMenuOpenChange={setShowTypeMenu}
        />

        <div className="flex-1 min-w-0 min-h-[24px] flex items-center">
          {renderBlockContent()}
        </div>
      </div>
    </div>
  );
};
