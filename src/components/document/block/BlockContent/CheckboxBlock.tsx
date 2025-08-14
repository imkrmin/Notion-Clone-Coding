import React from "react";
import type { Block } from "../../../../types/block";

interface CheckboxBlockProps {
  block: Block;
  onBlockChange: (blockId: string, content: string) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    blockId: string
  ) => void;
  onFocus: () => void;
  onBlur: () => void;
  updateBlockInDocument: (
    documentId: string,
    blockId: string,
    updates: Partial<Block>
  ) => void;
  documentId: string;
  placeholder: string;
}

export const CheckboxBlock: React.FC<CheckboxBlockProps> = ({
  block,
  onBlockChange,
  onKeyDown,
  onFocus,
  onBlur,
  updateBlockInDocument,
  documentId,
  placeholder,
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={block.checked}
        onChange={e =>
          updateBlockInDocument(documentId, block.id, {
            checked: e.target.checked,
          })
        }
        className="w-4 h-4"
      />
      <input
        type="text"
        value={block.content}
        onChange={e => onBlockChange(block.id, e.target.value)}
        onKeyDown={e => onKeyDown(e, block.id)}
        onFocus={onFocus}
        onBlur={onBlur}
        data-block-id={block.id}
        className="w-full placeholder:text-[#32302c] placeholder:opacity-40 placeholder:font-medium placeholder:text-md bg-transparent border-none outline-none text-base leading-relaxed"
        placeholder={placeholder}
      />
    </div>
  );
};
