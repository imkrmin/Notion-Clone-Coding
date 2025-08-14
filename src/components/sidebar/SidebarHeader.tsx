import { useNavigate } from "react-router-dom";
import { useDocumentActions } from "../../hooks/useDocumentActions";
import { BsPencilSquare } from "react-icons/bs";

const SidebarHeader = () => {
  const { createAndSelectPage } = useDocumentActions();
  const navigate = useNavigate();

  const handleNewDocument = () => {
    const newDoc = createAndSelectPage("새 페이지");
    navigate(`/documents/${newDoc.id}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-center gap-2">
          <img src="/notion.svg" alt="logo" className="w-6 h-6" />
          <span className="text-base text-center font-semibold text-[#32302c] cursor-default">
            노션 클론 코딩
          </span>
        </div>
        <button
          type="button"
          name="new-document"
          onClick={handleNewDocument}
          className="flex items-center justify-center text-[#5f5e5b] rounded-md w-7 h-7 hover:bg-[#D3D1CB] hover:bg-opacity-20 cursor-pointer"
        >
          <BsPencilSquare size={18} />
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
