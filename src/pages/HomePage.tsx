import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentStore } from "../stores/documentStore";
import { Card, CardContent } from "../components/ui";
import { getRelativeTime } from "../libs/getRelativeTime";
import { MdHistory, MdStar, MdCreate } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function HomePage() {
  const navigate = useNavigate();
  const { documents, selectDocument } = useDocumentStore();

  // 최근 방문한 페이지 (최근 수정된 순으로 정렬)
  const recentDocuments = useMemo(() => {
    return [...documents]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 6);
  }, [documents]);

  const recentCreatedDocuments = useMemo(() => {
    return [...documents]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [documents]);

  const rootDocuments = useMemo(() => {
    return documents.filter(doc => !doc.parentDocumentId);
  }, [documents]);

  const handlePageClick = (pageId: string) => {
    selectDocument(pageId);
    navigate(`/documents/${pageId}`);
  };

  const formatPageTitle = (title: string) => {
    return title.length > 20 ? `${title.slice(0, 20)}...` : title;
  };

  return (
    <div className="min-w-full min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center px-6 py-20 max-w-7xl tex-center">
          <h1 className="mb-2 text-4xl font-bold text-[#32302c]">
            노션 클론에 오신 것을 환영합니다.
          </h1>
          <p className="text-lg text-[#91918e]">
            아이디어를 정리하고, 문서를 작성하고, 지식을 체계화하세요!
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-20 px-6 py-8 mx-auto max-w-7xl">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MdHistory className="text-xl text-[#32302c]" />
            <h2 className="text-xl font-semibold text-[#32302c]">
              최근 방문한 페이지
            </h2>
          </div>
          {recentDocuments.length > 0 ? (
            <div className="flex gap-4 pb-2 overflow-x-auto scrollbar-hide">
              {recentDocuments.map(document => (
                <Card
                  key={document.id}
                  className="flex-shrink-0 transition-shadow cursor-pointer hover:shadow-md w-80"
                  onClick={() => handlePageClick(document.id)}
                >
                  <CardContent className="flex flex-col gap-6 py-4">
                    <div className="flex items-center gap-1">
                      {document.icon ? (
                        <span className="text-lg leading-none">
                          {document.icon}
                        </span>
                      ) : (
                        <IoDocumentTextOutline
                          name="document"
                          size={16}
                          className="text-[#5f5e5b]"
                        />
                      )}
                      <h3 className="font-medium text-[#32302c]">
                        {formatPageTitle(document.title)}
                      </h3>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-sm text-[#91918e]">
                        {getRelativeTime(document.updatedAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col gap-2 py-8 text-center text-[#32302c]">
                <MdHistory className="mx-auto text-3xl text-[#32302c]" />
                <p className="mx-auto text-medium text-[#32302c]">
                  아직 방문한 페이지가 없습니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <MdCreate className="text-xl text-[#32302c]" />
            <h2 className="text-xl font-semibold text-[#32302c]">
              최근 생성된 페이지
            </h2>
          </div>
          {recentCreatedDocuments.length > 0 ? (
            <div className="flex gap-8 pb-2 overflow-x-auto scrollbar-hide">
              {recentCreatedDocuments.map(document => (
                <Card
                  key={document.id}
                  className="flex-shrink-0 transition-shadow cursor-pointer hover:shadow-md w-80"
                  onClick={() => handlePageClick(document.id)}
                >
                  <CardContent className="flex flex-col gap-6 py-4">
                    <div className="flex items-center gap-1">
                      {document.icon ? (
                        <span className="text-lg leading-none">
                          {document.icon}
                        </span>
                      ) : (
                        <IoDocumentTextOutline
                          name="document"
                          size={16}
                          className="text-[#5f5e5b]"
                        />
                      )}
                      <h3 className="font-medium text-[#32302c]">
                        {formatPageTitle(document.title)}
                      </h3>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-sm text-[#91918e]">
                        {getRelativeTime(document.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col gap-2 py-8 text-center text-[#32302c]">
                <MdCreate className="mx-auto text-3xl text-[#32302c]" />
                <p className="mx-auto text-medium text-[#32302c]">
                  아직 생성된 페이지가 없습니다.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {rootDocuments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MdStar className="text-xl text-[#32302c]" />
              <h2 className="text-xl font-semibold text-[#32302c]">
                메인 페이지
              </h2>
            </div>
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
              {rootDocuments.map(document => (
                <Card
                  key={document.id}
                  className="flex-shrink-0 mb-2 transition-shadow cursor-pointer hover:shadow-md w-80"
                  onClick={() => handlePageClick(document.id)}
                >
                  <CardContent className="flex flex-col gap-10 py-4">
                    <div className="flex items-center gap-1">
                      {document.icon ? (
                        <span className="text-lg leading-none">
                          {document.icon}
                        </span>
                      ) : (
                        <IoDocumentTextOutline
                          name="document"
                          size={16}
                          className="text-[#5f5e5b]"
                        />
                      )}
                      <h3 className="font-medium text-[#32302c]">
                        {formatPageTitle(document.title)}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#91918e]">
                        하위 페이지 {document.childDocumentIds.length}개
                      </span>
                      <span className="text-sm text-[#91918e]">
                        {getRelativeTime(document.updatedAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
