import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentStore } from "../../../stores/documentStore";
import type { Block } from "../../../types/block";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { BlockItem } from "./BlockItem";
import { useBlockActions } from "../../../hooks/useBlockActions";
import { MdEmojiEmotions } from "react-icons/md";
import { IoClose } from "react-icons/io5";

interface BlockEditorProps {
  documentId: string;
}

const blockTypes = [
  { type: "paragraph", label: "텍스트", icon: "¶" },
  { type: "heading1", label: "제목 1", icon: "H1" },
  { type: "heading2", label: "제목 2", icon: "H2" },
  { type: "heading3", label: "제목 3", icon: "H3" },
  { type: "bulleted_list", label: "글머리 기호 목록", icon: "•" },
  { type: "numbered_list", label: "번호 매기기 목록", icon: "1." },
  { type: "checkbox", label: "체크박스", icon: "☐" },
  { type: "divider", label: "구분선", icon: "—" },
  { type: "page", label: "페이지", icon: "📄" },
];

export const BlockEditor: React.FC<BlockEditorProps> = ({ documentId }) => {
  const navigate = useNavigate();
  const { updateDocument, deleteDocument } = useDocumentStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const {
    currentDocument,
    blocks,
    handleAddBlock,
    handleDeleteBlock,
    handleBlockChange,
    handleBlockTypeChange,
    handleKeyDown,
    updateBlockInDocument,
  } = useBlockActions(documentId);

  const title = currentDocument?.title || "";

  useEffect(() => {
    if (!currentDocument) {
      navigate("/");
    }
  }, [currentDocument, navigate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    updateDocument(documentId, { title: newTitle });
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    updateDocument(documentId, { icon: emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const handleIconClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleIconDelete = () => {
    updateDocument(documentId, { icon: undefined });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowEmojiPicker(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderBlock = (block: Block) => {
    return (
      <div key={block.id} className="py-2 ">
        <BlockItem
          block={block}
          blocks={blocks}
          onAddBlock={handleAddBlock}
          onDeleteBlock={handleDeleteBlock}
          onBlockChange={handleBlockChange}
          onKeyDown={handleKeyDown}
          onBlockTypeChange={handleBlockTypeChange}
          updateBlockInDocument={updateBlockInDocument}
          documentId={documentId}
          blockTypes={blockTypes}
          deleteDocument={deleteDocument}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full mt-[100px] mb-[50px]">
      <div
        className={`flex flex-col w-full duration-200 group ${
          currentDocument?.icon ? "gap-8" : "gap-2"
        }`}
      >
        <div
          className={`relative flex transition-opacity duration-200 ${
            currentDocument?.icon ? "visible" : "invisible group-hover:visible"
          }`}
          ref={emojiPickerRef}
        >
          {currentDocument?.icon ? (
            <div className="relative group/icon">
              <span
                className="flex justify-center w-[80px] h-[80px] text-7xl hover:bg-[#D3D1CB] hover:bg-opacity-20 cursor-pointer transition-colors rounded-md p-2"
                onClick={handleIconClick}
              >
                {currentDocument.icon}
              </span>
              <button
                onClick={handleIconDelete}
                className="absolute flex items-center justify-center w-6 h-6 text-white transition-opacity duration-200 bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover/icon:opacity-100 hover:bg-red-600"
                title="아이콘 삭제"
              >
                <IoClose size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleIconClick}
              className="flex justify-center items-center w-fit text-[#91918e] hover:text-[#5f5e5b] hover:bg-[#D3D1CB] hover:bg-opacity-20 cursor-pointer transition-colors rounded-md px-2 py-1 gap-1"
            >
              <MdEmojiEmotions size={16} />
              아이콘 추가
            </button>
          )}

          {showEmojiPicker && (
            <div className="absolute left-0 z-50 mt-2 top-full">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={300}
                height={400}
              />
            </div>
          )}
        </div>

        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full py-1 text-4xl font-bold bg-transparent border-none outline-none"
          placeholder={title.trim() === "" ? "새 페이지" : "제목 없음"}
        />
      </div>

      <div className="flex-1 w-full mt-4">
        <div>{blocks.map(block => renderBlock(block))}</div>
      </div>
    </div>
  );
};
