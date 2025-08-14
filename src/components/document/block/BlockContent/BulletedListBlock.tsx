import React from "react";
import type { Block } from "../../../../types/block";

interface BulletedListBlockProps {
  block: Block;
  onBlockChange: (blockId: string, content: string) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    blockId: string
  ) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
}

export const BulletedListBlock: React.FC<BulletedListBlockProps> = ({
  block,
  onBlockChange,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 text-center">
      <span className="flex-shrink-0 text-lg text-[#37352f]">•</span>
      <input
        type="text"
        value={block.content}
        onChange={e => onBlockChange(block.id, e.target.value)}
        onKeyDown={e => onKeyDown(e, block.id)}
        onFocus={onFocus}
        onBlur={onBlur}
        data-block-id={block.id}
        className="w-full placeholder:text-[#32302c] placeholder:opacity-40 placeholder:font-medium placeholder:text-md bg-transparent border-none outline-none text-base text-[#37352f]"
        placeholder={placeholder}
      />
    </div>
  );
};
