export interface Block {
  id: string;
  pageId: string;
  type:
    | "paragraph"
    | "heading1"
    | "heading2"
    | "heading3"
    | "bulleted_list"
    | "numbered_list"
    | "checkbox"
    | "divider"
    | "page";
  content: string;
  checked?: boolean;
  order: number;
  linkedPageId?: string;
  icon?: string | null;
}

export interface BlockStore {
  blocks: Block[];

  // 블록 추가
  addBlockToDocument: (documentId: string, block: Block) => void;

  // 블록 업데이트
  updateBlockInDocument: (
    documentId: string,
    blockId: string,
    updates: Partial<Block>
  ) => void;

  // 블록 삭제
  deleteBlockFromDocument: (documentId: string, blockId: string) => void;

  // 블록 이동
  moveBlockInDocument: (
    documentId: string,
    blockId: string,
    newIndex: number
  ) => void;

  // 특정 문서의 블록들 가져오기
  getBlocksByDocumentId: (documentId: string) => Block[];

  // 특정 블록 가져오기
  getBlockById: (blockId: string) => Block | null;

  // 블록 순서 재정렬
  reorderBlocks: (documentId: string) => void;
}
