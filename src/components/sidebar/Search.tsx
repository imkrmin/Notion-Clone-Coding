import { IoIosSearch } from "react-icons/io";
import { SidebarMenu } from "./SidebarMenu";
import { Modal } from "../ui";

interface SearchProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const Search = ({ isModalOpen, setIsModalOpen }: SearchProps) => {
  return (
    <div>
      <SidebarMenu
        icon={<IoIosSearch size={20} />}
        label="검색"
        variant="search"
        onSearchClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <span className="text-3xl">⚠️</span>
            <span className="text-base text-[#91918e]">
              검색 기능은 서비스 준비중입니다. <br />
              빠른 시일 내에 추가 예정입니다.
            </span>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 cursor-pointer rounded-md transition-colors hover:bg-[#D3D1CB] hover:bg-opacity-20"
            >
              닫기
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Search;
