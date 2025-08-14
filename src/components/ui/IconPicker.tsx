import React from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

interface IconPickerProps {
  selectedIcon?: string;
  onIconSelect: (icon: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ onIconSelect }) => {
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onIconSelect(emojiData.emoji);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="overflow-hidden max-h-96">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          autoFocusSearch={false}
          searchPlaceHolder="이모지 검색..."
          width="100%"
          height={350}
        />
      </div>
    </div>
  );
};
