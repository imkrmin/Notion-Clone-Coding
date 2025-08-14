import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlockEditor } from "../components/document/block/BlockEditor";
import { useDocumentStore } from "../stores/documentStore";
import DocumentHeader from "../components/document/DocumentHeader";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDocumentById, selectDocument, getBlocksByDocumentId } =
    useDocumentStore();

  useEffect(() => {
    if (id) {
      const currentDocument = getDocumentById(id);
      if (currentDocument) {
        selectDocument(id);

        const blocks = getBlocksByDocumentId(id);
        if (blocks.length > 0 && blocks[0].content === "") {
          setTimeout(() => {
            const firstBlockInput = document.querySelector(
              `[data-block-id="${blocks[0].id}"] input`
            ) as HTMLInputElement;
            if (firstBlockInput) {
              firstBlockInput.focus();
            }
          }, 100);
        }
      } else {
        navigate("/");
      }
    }
  }, [id, getDocumentById, selectDocument, navigate, getBlocksByDocumentId]);

  return (
    <div className="flex flex-col w-full h-screen">
      <DocumentHeader documentId={id!} />
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-[100px]">
          <BlockEditor documentId={id!} />
        </div>
      </div>
    </div>
  );
}
