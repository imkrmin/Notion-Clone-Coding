import React from "react";
import type { Block } from "../../../../types/block";

interface NumberedListBlockProps {
  block: Block;
  blocks: Block[];
  onBlockChange: (blockId: string, content: string) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    blockId: string
  ) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
}

export const NumberedListBlock: React.FC<NumberedListBlockProps> = ({
  block,
  blocks,
  onBlockChange,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder,
}) => {
  const getNumberedListNumber = () => {
    const currentIndex = blocks.findIndex(b => b.id === block.id);
    let currentNumber = 1;

    for (let i = currentIndex - 1; i >= 0; i--) {
      if (blocks[i].type === "numbered_list") {
        currentNumber++;
      } else {
        break;
      }
    }

    return currentNumber;
  };

  return (
    <div className="flex items-center gap-1">
      <span className="flex-shrink-0 w-6 text-sm font-medium text-center text-gray-400">
        {getNumberedListNumber()}.
      </span>
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
