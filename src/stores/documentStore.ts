import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Document, DocumentStore } from "../types/document";
import type { Block } from "../types/block";

const initialDocuments: Document[] = [];

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: initialDocuments,
      currentDocument: null,
      expandedDocuments: new Set<string>(),
      blocks: [],

      createDocument: (title = "새 페이지", parentDocumentId, icon) => {
        const parentDocument = parentDocumentId
          ? get().documents.find(d => d.id === parentDocumentId)
          : null;
        const level = parentDocument ? parentDocument.level + 1 : 0;

        const newDocument: Document = {
          id: crypto.randomUUID(),
          title: title || "새 페이지",
          icon: icon || null,
          parentDocumentId,
          childDocumentIds: [],
          blockIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          level,
        };

        // 모든 변경사항을 한 번에 업데이트
        set(state => {
          let updatedDocuments = [...state.documents, newDocument];

          // 부모 문서가 있으면 하위페이지 관계 설정
          if (parentDocumentId) {
            updatedDocuments = updatedDocuments.map(document =>
              document.id === parentDocumentId
                ? {
                    ...document,
                    childDocumentIds: [
                      ...document.childDocumentIds,
                      newDocument.id,
                    ],
                    updatedAt: new Date(),
                  }
                : document
            );
          }

          return {
            documents: updatedDocuments,
          };
        });

        // 상태에 저장된 실제 문서 객체 반환
        return (
          get().documents.find(d => d.id === newDocument.id) || newDocument
        );
      },

      updateDocument: (id, updates) => {
        set(state => ({
          documents: state.documents.map(document =>
            document.id === id
              ? { ...document, ...updates, updatedAt: new Date() }
              : document
          ),
        }));

        const { currentDocument } = get();
        if (currentDocument?.id === id) {
          set(() => ({
            currentDocument: {
              ...currentDocument,
              ...updates,
              updatedAt: new Date(),
            },
          }));
        }
      },

      deleteDocument: id => {
        set(state => {
          const document = state.documents.find(d => d.id === id);
          if (!document) return state;

          const childDocumentIds = document.childDocumentIds;

          // 삭제되는 문서와 하위 문서들을 expandedDocuments에서도 제거
          const newExpandedDocuments = new Set(state.expandedDocuments);
          newExpandedDocuments.delete(id);
          childDocumentIds.forEach(childId =>
            newExpandedDocuments.delete(childId)
          );

          return {
            documents: state.documents.filter(
              d => d.id !== id && !childDocumentIds.includes(d.id)
            ),
            currentDocument:
              state.currentDocument?.id === id ? null : state.currentDocument,
            expandedDocuments: newExpandedDocuments,
          };
        });
      },

      moveDocument: (documentId, newParentDocumentId) => {
        set(state => {
          const document = state.documents.find(d => d.id === documentId);
          if (!document) return state;

          if (document.parentDocumentId) {
            state.documents = state.documents.map(d =>
              d.id === document.parentDocumentId
                ? {
                    ...d,
                    childDocumentIds: d.childDocumentIds.filter(
                      id => id !== documentId
                    ),
                    updatedAt: new Date(),
                  }
                : d
            );
          }

          if (newParentDocumentId) {
            state.documents = state.documents.map(d =>
              d.id === newParentDocumentId
                ? {
                    ...d,
                    childDocumentIds: [...d.childDocumentIds, documentId],
                    updatedAt: new Date(),
                  }
                : d
            );
          }

          return {
            documents: state.documents.map(d =>
              d.id === documentId
                ? {
                    ...d,
                    parentDocumentId: newParentDocumentId,
                    updatedAt: new Date(),
                  }
                : d
            ),
          };
        });
      },

      selectDocument: id => {
        const document = get().documents.find(d => d.id === id);
        set(() => ({
          currentDocument: document || null,
        }));
      },

      clearSelection: () => {
        set(() => ({
          currentDocument: null,
        }));
      },

      getDocumentById: id => {
        return get().documents.find(document => document.id === id) || null;
      },

      getChildDocuments: parentDocumentId => {
        return get().documents.filter(
          document => document.parentDocumentId === parentDocumentId
        );
      },

      // 사이드바 폴더 토글
      toggleFolder: (folderId: string) => {
        set(state => {
          const newExpanded = new Set(state.expandedDocuments);
          if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
          } else {
            newExpanded.add(folderId);
          }
          return {
            ...state,
            expandedDocuments: newExpanded,
          };
        });
      },

      addBlockToDocument: (documentId, block) => {
        const newBlock: Block = {
          ...block,
          pageId: documentId,
        };

        set(state => {
          // 새 블록의 order가 이미 설정되어 있음 (block.order 사용)
          const newOrder = newBlock.order;

          // 새 블록보다 order가 크거나 같은 기존 블록들의 order를 1씩 증가
          const updatedBlocks = state.blocks.map(b =>
            b.pageId === documentId && b.order >= newOrder
              ? { ...b, order: b.order + 1 }
              : b
          );

          return {
            ...state,
            blocks: [...updatedBlocks, newBlock],
          };
        });
      },

      updateBlockInDocument: (documentId, blockId, updates) => {
        set(state => ({
          ...state,
          blocks: state.blocks.map(block =>
            block.pageId === documentId && block.id === blockId
              ? { ...block, ...updates }
              : block
          ),
        }));
      },

      deleteBlockFromDocument: (documentId, blockId) => {
        set(state => {
          const updatedBlocks = state.blocks.filter(
            block => !(block.pageId === documentId && block.id === blockId)
          );

          // 삭제 후 남은 블록들의 order를 재정렬
          const remainingBlocks = updatedBlocks
            .filter(b => b.pageId === documentId)
            .sort((a, b) => a.order - b.order);

          // order 값을 0부터 순차적으로 재할당
          const reorderedBlocks = remainingBlocks.map((block, index) => ({
            ...block,
            order: index,
          }));

          // 전체 블록 배열에서 해당 문서의 블록들만 업데이트
          const finalBlocks = [
            ...updatedBlocks.filter(b => b.pageId !== documentId),
            ...reorderedBlocks,
          ];

          return {
            ...state,
            blocks: finalBlocks,
          };
        });
      },

      moveBlockInDocument: (documentId, blockId, newIndex) => {
        set(state => {
          const documentBlocks = state.blocks.filter(
            b => b.pageId === documentId
          );
          const blockIndex = documentBlocks.findIndex(b => b.id === blockId);

          if (blockIndex === -1) return state;

          const newOrder = newIndex;
          const oldOrder = documentBlocks[blockIndex].order;

          // order 값 업데이트
          const updatedBlocks = state.blocks.map(block => {
            if (block.pageId !== documentId) return block;

            if (block.id === blockId) {
              return { ...block, order: newOrder };
            }

            // 이동 범위에 있는 블록들의 order 조정
            if (oldOrder < newOrder) {
              // 아래로 이동: oldOrder와 newOrder 사이의 블록들을 위로
              if (block.order > oldOrder && block.order <= newOrder) {
                return { ...block, order: block.order - 1 };
              }
            } else {
              // 위로 이동: newOrder와 oldOrder 사이의 블록들을 아래로
              if (block.order >= newOrder && block.order < oldOrder) {
                return { ...block, order: block.order + 1 };
              }
            }

            return block;
          });

          return { ...state, blocks: updatedBlocks };
        });
      },

      getBlocksByDocumentId: documentId => {
        return get()
          .blocks.filter(block => block.pageId === documentId)
          .sort((a, b) => a.order - b.order);
      },

      getBlockById: blockId => {
        return get().blocks.find(block => block.id === blockId) || null;
      },

      reorderBlocks: documentId => {
        set(state => {
          const documentBlocks = state.blocks
            .filter(b => b.pageId === documentId)
            .sort((a, b) => a.order - b.order);

          // order 값을 0부터 순차적으로 재할당
          const reorderedBlocks = documentBlocks.map((block, index) => ({
            ...block,
            order: index,
          }));

          // 전체 블록 배열에서 해당 문서의 블록들만 업데이트
          const otherBlocks = state.blocks.filter(b => b.pageId !== documentId);

          return {
            ...state,
            blocks: [...otherBlocks, ...reorderedBlocks],
          };
        });
      },
    }),
    {
      name: "app-storage",
      partialize: state => {
        return {
          documents: state.documents,
          expandedDocuments: Array.from(state.expandedDocuments),
          blocks: state.blocks,
        };
      },
      onRehydrateStorage: () => state => {
        if (state) {
          state.expandedDocuments = new Set(
            state.expandedDocuments as unknown as string[]
          );
        }
      },
    }
  )
);
