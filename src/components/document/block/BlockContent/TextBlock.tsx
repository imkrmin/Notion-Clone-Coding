import React from "react";
import type { Block } from "../../../../types/block";

interface TextBlockProps {
  block: Block;
  onBlockChange: (blockId: string, content: string) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    blockId: string
  ) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
  onSlashInput?: (blockId: string) => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  block,
  onBlockChange,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder,
  onSlashInput,
}) => {
  const getTextStyles = () => {
    switch (block.type) {
      case "heading1":
        return "text-3xl font-bold text-[#32302c]";
      case "heading2":
        return "text-2xl font-semibold text-[#32302c]";
      case "heading3":
        return "text-xl font-medium text-[#32302c]";
      case "paragraph":
      default:
        return "text-md text-[#32302c] leading-relaxed";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    onBlockChange(block.id, newContent);

    if (newContent === "/" && onSlashInput) {
      onSlashInput(block.id);
    }
  };

  return (
    <input
      type="text"
      value={block.content}
      onChange={handleChange}
      onKeyDown={e => onKeyDown(e, block.id)}
      onFocus={onFocus}
      onBlur={onBlur}
      data-block-id={block.id}
      className={`w-full placeholder:text-[#32302c] placeholder:opacity-40 placeholder:font-medium placeholder:text-md bg-transparent border-none outline-none ${getTextStyles()}`}
      placeholder={placeholder}
    />
  );
};
