import { useDocumentStore } from "../../stores/documentStore";
import { useDocumentActions } from "../../hooks/useDocumentActions";
import { Tooltip } from "../ui/Tooltip";
import { getRelativeTime } from "../../libs/getRelativeTime";
import { getCreationDate } from "../../libs/getCreationDate";
import { useState, useRef } from "react";
import { Menu } from "../ui/Menu";
import { IoStarOutline, IoTrashOutline } from "react-icons/io5";
import { IoIosArrowDown, IoIosMore, IoMdLock } from "react-icons/io";

const DocumentHeader = ({ documentId }: { documentId: string }) => {
  const { getDocumentById } = useDocumentStore();
  const { deletePageAndNavigate } = useDocumentActions();

  const doc = getDocumentById(documentId);
  const title = doc?.title || "새 페이지";
  const icon = doc?.icon;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  const handleDeletePage = () => {
    deletePageAndNavigate(documentId);
    setIsMenuOpen(false);
  };

  const getMenuPosition = () => {
    if (!menuButtonRef.current) return undefined;

    const rect = menuButtonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const menuWidth = 160;

    const buttonCenter = rect.left + rect.width / 2;
    let left = buttonCenter - menuWidth / 2;

    if (left < 8) {
      left = 8;
    }

    if (left + menuWidth > viewportWidth - 8) {
      left = viewportWidth - menuWidth - 8;
    }

    return {
      top: rect.bottom + 4,
      left: left,
    };
  };

  return (
    <div className="sticky top-0 flex items-center justify-between w-full px-5 py-2 bg-white">
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-1">
          {icon && <span className="text-base">{icon}</span>}
          <span className="text-base text-center text-[#32302c] cursor-default transition-colors">
            {title}
          </span>
        </div>
        <Tooltip content="본인만 엑세스 가능" position="right">
          <div className="flex justify-center items-center gap-1 text-[#464440] opacity-40 hover:bg-[#D3D1CB] hover:bg-opacity-30 cursor-default transition-colors rounded-md p-1">
            <IoMdLock size={16} />
            개인 페이지
            <IoIosArrowDown size={12} />
          </div>
        </Tooltip>
      </div>
      <div className="flex items-center justify-center gap-2 text-base text-center text-[#32302c]">
        <Tooltip
          content={doc?.createdAt && getCreationDate(doc.createdAt)}
          position="bottom"
        >
          <span className="!text-[#91918e] text-sm whitespace-nowrap flex-shrink-0 cursor-default">
            {doc?.updatedAt && getRelativeTime(doc.updatedAt)}
          </span>
        </Tooltip>
        <span className="hover:bg-[#D3D1CB] hover:bg-opacity-30 cursor-pointer transition-colors rounded-md p-1 flex-shrink-0">
          공유
        </span>
        <IoStarOutline
          size={24}
          className="text-[#32302c] hover:bg-[#D3D1CB] hover:bg-opacity-30 cursor-pointer transition-colors rounded-md p-1 flex-shrink-0"
        />
        <Menu
          trigger={
            <div
              ref={menuButtonRef}
              onClick={e => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <IoIosMore
                size={30}
                className="hover:bg-[#D3D1CB] hover:bg-opacity-30 cursor-pointer transition-colors rounded-md p-1 flex-shrink-0"
              />
            </div>
          }
          items={[
            {
              label: "페이지 삭제하기",
              icon: <IoTrashOutline size={18} />,
              onClick: handleDeletePage,
              className:
                "hover:text-red-600 font-normal hover:bg-[#D3D1CB] hover:bg-opacity-30",
            },
          ]}
          isOpen={isMenuOpen}
          onOpenChange={setIsMenuOpen}
          triggerOnClick={false}
          position={getMenuPosition()}
        />
      </div>
    </div>
  );
};

export default DocumentHeader;
