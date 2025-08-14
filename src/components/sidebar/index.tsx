import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarHeader from "./SidebarHeader";
import { SidebarDocumentItem } from "./SidebarDocumentItem";
import { SidebarMenu } from "./SidebarMenu";
import Search from "./Search";
import { useDocumentStore } from "../../stores/documentStore";
import { GoHome, GoInbox, GoPlus, GoTrash } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { GrTemplate } from "react-icons/gr";
export { SidebarDocumentItem } from "./SidebarDocumentItem";

interface SidebarProps {
  onDocumentSelect: (documentId: string) => void;
  selectedDocumentId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onDocumentSelect,
  selectedDocumentId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { documents, expandedDocuments, toggleFolder } = useDocumentStore();

  const urlDocumentId = location.pathname.startsWith("/documents/")
    ? location.pathname.split("/documents/")[1]
    : null;

  const effectiveSelectedId = selectedDocumentId || urlDocumentId || undefined;

  useEffect(() => {
    if (urlDocumentId && urlDocumentId !== selectedDocumentId) {
      onDocumentSelect(urlDocumentId);
    }
  }, [location.pathname, urlDocumentId, selectedDocumentId, onDocumentSelect]);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSharedPagesExpanded, setIsSharedPagesExpanded] = useState(false);
  const [isPersonalPagesExpanded, setIsPersonalPagesExpanded] = useState(true);

  return (
    <div className="fixed left-0 top-0 flex flex-col w-[240px] h-full bg-[#F9F8F7] bg-opacity-90 border-r py-2 border-gray-200">
      <div className="flex flex-col gap-1 px-4 pb-2 border-b border-gray-200">
        <SidebarHeader />
        <Search
          isModalOpen={isSearchModalOpen}
          setIsModalOpen={setIsSearchModalOpen}
        />
        <SidebarMenu
          icon={<GoHome size={20} />}
          label="홈"
          variant="home"
          onClick={() => navigate("/")}
        />
        <SidebarMenu icon={<GoInbox size={18} />} label="수신함" />
      </div>

      <div className="flex flex-col flex-1 gap-4 pl-4 pr-2 overflow-y-scroll">
        <div className="flex flex-col gap-2 ">
          <button
            onClick={() => setIsSharedPagesExpanded(!isSharedPagesExpanded)}
            className="flex items-center mt-4 gap-2 text-sm font-medium text-[#91918e] hover:text-[#5f5e5b] cursor-pointer transition-colors"
          >
            공유된 페이지
          </button>
          {isSharedPagesExpanded && (
            <div className="flex items-center gap-2 ml-1 px-1 py-1 text-base font-medium text-[#91918e] cursor-pointer rounded-md transition-colors hover:bg-[#D3D1CB] hover:bg-opacity-20">
              <GoPlus size={20} />
              공동 작업 시작하기
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                setIsPersonalPagesExpanded(!isPersonalPagesExpanded)
              }
              className="flex items-center gap-2 text-sm font-medium text-[#91918e] hover:text-[#5f5e5b] cursor-pointer transition-colors"
            >
              개인 페이지
            </button>
          </div>
          {isPersonalPagesExpanded && (
            <div className="flex-1">
              {documents
                .filter(item => !item.parentDocumentId)
                .map(item => (
                  <SidebarDocumentItem
                    key={item.id}
                    item={item}
                    level={0}
                    expandedItems={expandedDocuments}
                    isSelected={effectiveSelectedId === item.id}
                    selectedDocumentId={effectiveSelectedId}
                    onToggleFolder={toggleFolder}
                    onSelectDocument={onDocumentSelect}
                  />
                ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <SidebarMenu icon={<IoSettingsOutline size={18} />} label="설정" />
          <SidebarMenu icon={<GrTemplate size={18} />} label="템플릿" />
          <SidebarMenu icon={<GoTrash size={18} />} label="휴지통" />
        </div>
      </div>
      <div className="h-[100px] border-t border-gray-200" />
    </div>
  );
};
