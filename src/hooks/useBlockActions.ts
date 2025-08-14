import { useEffect, useCallback, useRef } from "react";
import { useDocumentStore } from "../stores/documentStore";
import { getBlockUpdateFromMarkdown } from "../libs/markdownDetector";
import type { Block } from "../types/block";

export const useBlockActions = (documentId: string) => {
  const {
    getDocumentById,
    getChildDocuments,
    createDocument,
    deleteDocument,
    addBlockToDocument,
    updateBlockInDocument,
    deleteBlockFromDocument,
    getBlocksByDocumentId,
  } = useDocumentStore();

  const currentDocument = getDocumentById(documentId);
  const blocks = getBlocksByDocumentId(documentId);
  const isInitialized = useRef(false);

  useEffect(() => {
    // 문서 ID가 변경되면 초기화 플래그 리셋
    isInitialized.current = false;
  }, [documentId]);

  useEffect(() => {
    if (currentDocument && !isInitialized.current) {
      // 현재 블록 상태를 직접 가져와서 확인
      const currentBlocks = getBlocksByDocumentId(documentId);

      if (currentBlocks.length === 0) {
        const initialBlock: Block = {
          id: crypto.randomUUID(),
          pageId: documentId,
          type: "paragraph",
          content: "",
          order: 0,
        };
        addBlockToDocument(documentId, initialBlock);
        isInitialized.current = true;
        return;
      }

      // 하위 페이지 블록 생성은 실제 하위 페이지가 있을 때만
      const childDocuments = getChildDocuments(documentId);
      if (childDocuments.length > 0) {
        // 이미 page 타입 블록으로 존재하는 하위 페이지들
        const existingPageBlocks = currentBlocks.filter(
          block => block.type === "page" && block.linkedPageId
        );

        // 아직 블록으로 생성되지 않은 하위 페이지들
        const missingPageBlocks = childDocuments.filter(
          childDoc =>
            !existingPageBlocks.some(
              block => block.linkedPageId === childDoc.id
            )
        );

        // 누락된 하위 페이지들을 블록으로 생성
        missingPageBlocks.forEach((childDoc, index) => {
          const existingPageBlocks = currentBlocks.filter(
            block => block.type === "page" && block.linkedPageId
          );

          let baseOrder: number;
          if (existingPageBlocks.length > 0) {
            const maxOrder = Math.max(...existingPageBlocks.map(b => b.order));
            baseOrder = maxOrder + 1;
          } else {
            baseOrder = currentBlocks.length;
          }

          const insertPosition = baseOrder + index;

          const newBlock: Block = {
            id: crypto.randomUUID(),
            pageId: documentId,
            type: "page",
            content: childDoc.title,
            linkedPageId: childDoc.id,
            order: insertPosition,
          };

          addBlockToDocument(documentId, newBlock);
        });
      }

      isInitialized.current = true;
    }
  }, [
    currentDocument,
    documentId,
    addBlockToDocument,
    getChildDocuments,
    getBlocksByDocumentId,
  ]);

  // 블록 추가
  const handleAddBlock = useCallback(
    (afterBlockId: string, type: Block["type"] = "paragraph") => {
      const currentBlock = blocks.find(b => b.id === afterBlockId);
      if (!currentBlock) return;

      // 새 블록 생성
      const newBlock: Block = {
        id: crypto.randomUUID(),
        pageId: documentId,
        type,
        content: "",
        checked: type === "checkbox" ? false : undefined,
        order: currentBlock.order + 1, // 현재 블록 다음 order
      };

      // order 기반으로 정확한 위치에 삽입
      addBlockToDocument(documentId, newBlock);

      // 새로 생성된 블록에 포커스 이동 (DOM 업데이트 후)
      requestAnimationFrame(() => {
        setTimeout(() => {
          const newBlockElement = document.querySelector(
            `[data-block-id="${newBlock.id}"]`
          );
          if (newBlockElement) {
            const input = newBlockElement.querySelector("input");
            if (input) {
              input.focus();
              // 커서를 입력 필드 끝으로 이동
              input.setSelectionRange(input.value.length, input.value.length);
            }
          }
        }, 100); // DOM 업데이트를 위해 더 긴 지연 추가
      });
    },
    [documentId, addBlockToDocument, blocks]
  );

  // 블록 삭제
  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      if (!currentDocument) return;

      const blockIndex = blocks.findIndex(b => b.id === blockId);

      if (blocks.length === 1) {
        // 블록이 1개뿐일 때는 첫 번째 블록을 삭제하지 않고 내용만 비움
        updateBlockInDocument(documentId, blockId, { content: "" });

        // 포커스를 첫 번째 블록으로 이동
        setTimeout(() => {
          const firstBlockInput = document.querySelector(
            `[data-block-id="${blockId}"] input`
          ) as HTMLInputElement;
          if (firstBlockInput) {
            firstBlockInput.focus();
          }
        }, 0);
      } else {
        // 블록이 2개 이상일 때는 모든 블록 삭제 가능
        deleteBlockFromDocument(documentId, blockId);

        // 삭제 후 적절한 블록으로 포커스 이동
        if (blockIndex === 0) {
          // 첫 번째 블록을 삭제한 경우, 새로운 첫 번째 블록으로 포커스
          const newFirstBlock = blocks[1]; // 삭제 전 상태에서 두 번째 블록
          if (newFirstBlock) {
            setTimeout(() => {
              const newFirstBlockInput = document.querySelector(
                `[data-block-id="${newFirstBlock.id}"] input`
              ) as HTMLInputElement;
              if (newFirstBlockInput) {
                newFirstBlockInput.focus();
              }
            }, 0);
          }
        } else {
          // 다른 블록을 삭제한 경우, 이전 블록으로 포커스
          const previousBlock = blocks[blockIndex - 1];
          if (previousBlock) {
            setTimeout(() => {
              const previousBlockInput = document.querySelector(
                `[data-block-id="${previousBlock.id}"] input`
              ) as HTMLInputElement;
              if (previousBlockInput) {
                previousBlockInput.focus();
              }
            }, 0);
          }
        }
      }
    },
    [
      documentId,
      currentDocument,
      updateBlockInDocument,
      deleteBlockFromDocument,
      blocks,
    ]
  );

  // 노션 스타일 마크다운 인식 함수
  const detectMarkdownAndUpdateBlock = useCallback(
    (blockId: string, content: string) => {
      if (!currentDocument) return;

      // 현재 블록의 타입을 확인
      const currentBlock = blocks.find(b => b.id === blockId);
      if (!currentBlock) return;

      // 마크다운 감지 및 블록 업데이트
      const updates = getBlockUpdateFromMarkdown(currentBlock, content);
      updateBlockInDocument(documentId, blockId, updates);
    },
    [documentId, currentDocument, updateBlockInDocument, blocks]
  );

  // 빈 블록 자동 정리 (노션처럼)
  const cleanupEmptyBlocks = useCallback(() => {
    const emptyBlocks = blocks.filter(
      (block, index) =>
        index > 0 && // 첫 번째 블록 제외
        block.content.trim() === "" &&
        block.type === "paragraph" // 텍스트 블록만
    );

    // 빈 블록들을 삭제 (마지막부터 삭제하여 인덱스 문제 방지)
    emptyBlocks.reverse().forEach(block => {
      deleteBlockFromDocument(documentId, block.id);
    });
  }, [documentId, blocks, deleteBlockFromDocument]);

  // 블록 내용 변경
  const handleBlockChange = useCallback(
    (blockId: string, content: string) => {
      if (currentDocument) {
        // /page 문법 감지 및 새 페이지 생성
        if (content.startsWith("/page ")) {
          const pageTitle = content.slice(7);
          if (pageTitle.trim()) {
            const newPage = createDocument(pageTitle, documentId);

            // 기존 하위페이지 블록들의 최대 order 값을 찾음
            const existingPageBlocks = blocks.filter(
              block => block.type === "page" && block.linkedPageId
            );

            let newOrder: number;
            if (existingPageBlocks.length > 0) {
              // 기존 하위페이지 블록이 있으면 최대 order + 1
              const maxOrder = Math.max(
                ...existingPageBlocks.map(b => b.order)
              );
              newOrder = maxOrder + 1;
            } else {
              // 기존 하위페이지 블록이 없으면 기존 블록들 뒤
              newOrder = blocks.length;
            }

            // 기존 블록을 삭제하고 새로운 page 블록을 맨 끝에 추가
            deleteBlockFromDocument(documentId, blockId);

            const newPageBlock: Block = {
              id: crypto.randomUUID(),
              pageId: documentId,
              type: "page",
              content: pageTitle,
              linkedPageId: newPage.id,
              order: newOrder,
            };

            addBlockToDocument(documentId, newPageBlock);

            // 새 페이지로 이동하지 않고 현재 페이지에 머무름
            // 사용자가 하위 페이지 블록을 클릭할 때 이동하도록 함
            return;
          }
        }

        detectMarkdownAndUpdateBlock(blockId, content);

        // 내용이 비워진 경우 빈 블록 정리 (노션처럼)
        if (content.trim() === "") {
          setTimeout(cleanupEmptyBlocks, 1000); // 1초 후 정리
        }
      }
    },
    [
      currentDocument,
      detectMarkdownAndUpdateBlock,
      cleanupEmptyBlocks,
      createDocument,
      documentId,
      deleteBlockFromDocument,
      addBlockToDocument,
      blocks,
    ]
  );

  // 블록 타입 변경
  const handleBlockTypeChange = useCallback(
    (blockId: string, newType: Block["type"]) => {
      if (currentDocument) {
        // 현재 블록을 찾아서 linkedPageId가 있는지 확인
        const currentBlock = blocks.find(b => b.id === blockId);
        if (!currentBlock) return;

        // page 타입에서 다른 타입으로 변경되는 경우
        if (currentBlock.type === "page" && newType !== "page") {
          if (currentBlock.linkedPageId) {
            deleteDocument(currentBlock.linkedPageId);
          }

          // 블록을 새 타입으로 변경하고 내용 초기화, linkedPageId 제거
          updateBlockInDocument(documentId, blockId, {
            type: newType,
            content: "",
            linkedPageId: undefined,
          });
        } else {
          // / 입력 후 타입 변경 시 내용 초기화
          const shouldClearContent = currentBlock.content === "/";
          updateBlockInDocument(documentId, blockId, {
            type: newType,
            content: shouldClearContent ? "" : currentBlock.content,
          });
        }
      }
    },
    [documentId, currentDocument, updateBlockInDocument, blocks, deleteDocument]
  );

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, blockId: string) => {
      if (e.key === "Backspace" && e.currentTarget.value === "") {
        e.preventDefault();
        handleDeleteBlock(blockId);
      } else if (e.key === "Enter") {
        e.preventDefault();

        // 현재 블록의 인덱스 찾기
        const currentBlockIndex = blocks.findIndex(
          block => block.id === blockId
        );
        if (currentBlockIndex === -1) return;

        // 새 블록 생성
        handleAddBlock(blockId, "paragraph");
      }
    },
    [handleDeleteBlock, handleAddBlock, blocks]
  );

  return {
    // 상태
    currentDocument,
    blocks,

    // 액션 함수들
    handleAddBlock,
    handleDeleteBlock,
    handleBlockChange,
    handleBlockTypeChange,
    handleKeyDown,

    // 유틸리티
    updateBlockInDocument,
  };
};
