import { useDocumentStore } from "../stores/documentStore";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useDocumentActions = () => {
  const navigate = useNavigate();
  const { createDocument, deleteDocument, selectDocument, getChildDocuments } =
    useDocumentStore();

  /**
   * 새 페이지를 생성하고 선택합니다
   */
  const createAndSelectPage = (
    title?: string,
    parentDocumentId?: string,
    icon?: string
  ) => {
    const newPage = createDocument(title, parentDocumentId, icon);
    selectDocument(newPage.id);
    return newPage;
  };

  /**
   * 하위 페이지를 생성하고 선택합니다
   */
  const createSubPage = (
    parentDocumentId: string,
    title?: string,
    icon?: string
  ) => {
    return createAndSelectPage(title, parentDocumentId, icon);
  };

  /**
   * 페이지와 모든 하위 페이지를 삭제합니다
   */
  const deletePageWithChildren = useCallback(
    (documentId: string) => {
      deleteDocument(documentId);
    },
    [deleteDocument]
  );

  /**
   * 페이지를 삭제하고 홈으로 이동합니다
   */
  const deletePageAndNavigate = useCallback(
    (documentId: string) => {
      const childDocuments = getChildDocuments(documentId);
      const hasChildren = childDocuments.length > 0;

      const confirmDelete =
        !hasChildren ||
        window.confirm("하위 페이지가 있는 페이지를 삭제하시겠습니까?");

      if (!confirmDelete) return;

      deletePageWithChildren(documentId);
      navigate("/");
    },
    [navigate, deletePageWithChildren, getChildDocuments]
  );

  return {
    createAndSelectPage,
    createSubPage,
    deletePageWithChildren,
    deletePageAndNavigate,
  };
};
