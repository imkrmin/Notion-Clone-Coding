import type { Block } from "./block";

export interface Document {
  id: string;
  title: string;
  icon?: string | null;
  parentDocumentId?: string;
  childDocumentIds: string[];
  blockIds: string[];
  createdAt: Date;
  updatedAt: Date;
  level: number;
}

export interface DocumentStore {
  documents: Document[];
  currentDocument: Document | null;
  expandedDocuments: Set<string>;
  blocks: Block[];
  createDocument: (
    title?: string,
    parentDocumentId?: string,
    icon?: string
  ) => Document;
  updateDocument: (
    id: string,
    updates: Partial<Pick<Document, "title" | "icon">>
  ) => void;
  deleteDocument: (id: string) => void;
  moveDocument: (documentId: string, newParentDocumentId?: string) => void;
  selectDocument: (id: string) => void;
  clearSelection: () => void;
  getDocumentById: (id: string) => Document | null;
  getChildDocuments: (parentDocumentId: string) => Document[];
  toggleFolder: (folderId: string) => void;

  addBlockToDocument: (
    documentId: string,
    block: Omit<Block, "pageId">
  ) => void;
  updateBlockInDocument: (
    documentId: string,
    blockId: string,
    updates: Partial<Block>
  ) => void;
  deleteBlockFromDocument: (documentId: string, blockId: string) => void;
  moveBlockInDocument: (
    documentId: string,
    blockId: string,
    newIndex: number
  ) => void;
  getBlocksByDocumentId: (documentId: string) => Block[];
  getBlockById: (blockId: string) => Block | null;
  reorderBlocks: (documentId: string) => void;
}
