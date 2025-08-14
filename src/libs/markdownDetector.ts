import type { Block } from "../types/block";

export interface MarkdownDetectionResult {
  type: Block["type"];
  content: string;
  checked?: boolean;
  linkedPageId?: string;
}

/**
 * 마크다운 문법을 감지하여 블록 타입과 내용을 반환
 * @param content 입력된 텍스트 내용
 * @returns 감지된 블록 타입과 정리된 내용
 */
export const detectMarkdownSyntax = (
  content: string
): MarkdownDetectionResult | null => {
  if (content.startsWith("# ")) {
    return {
      type: "heading1",
      content: content.slice(2),
    };
  }

  if (content.startsWith("## ")) {
    return {
      type: "heading2",
      content: content.slice(3),
    };
  }

  if (content.startsWith("### ")) {
    return {
      type: "heading3",
      content: content.slice(4),
    };
  }

  if (content.startsWith("- ")) {
    return {
      type: "bulleted_list",
      content: content.slice(2),
    };
  }

  if (content.startsWith("1. ")) {
    return {
      type: "numbered_list",
      content: content.slice(3),
    };
  }

  if (content.startsWith("[] ")) {
    return {
      type: "checkbox",
      content: content.slice(3),
      checked: false,
    };
  }

  if (content.startsWith("[x] ")) {
    return {
      type: "checkbox",
      content: content.slice(4),
      checked: true,
    };
  }

  if (content === "---") {
    return {
      type: "divider",
      content: "",
    };
  }

  if (content.startsWith("/page ")) {
    return {
      type: "page",
      content: content.slice(7),
      linkedPageId: undefined,
    };
  }

  return null;
};

/**
 * 블록의 마크다운 문법을 감지하고 적절한 업데이트를 반환합니다.
 * @param currentBlock 현재 블록
 * @param content 입력된 텍스트 내용
 * @returns 업데이트할 블록 속성들
 */
export const getBlockUpdateFromMarkdown = (
  currentBlock: Block,
  content: string
): Partial<Block> => {
  // 이미 특정 타입으로 설정된 블록은 타입을 변경하지 않음
  if (currentBlock.type !== "paragraph") {
    return { content };
  }

  // paragraph 타입일 때만 마크다운 감지
  const markdownResult = detectMarkdownSyntax(content);

  if (markdownResult) {
    const update: Partial<Block> = {
      type: markdownResult.type,
      content: markdownResult.content,
    };

    // checkbox 타입인 경우 checked 속성 추가
    if (markdownResult.type === "checkbox") {
      update.checked = markdownResult.checked;
    }

    // page 타입인 경우 linkedPageId 초기화
    if (markdownResult.type === "page") {
      update.linkedPageId = markdownResult.linkedPageId;
    }

    return update;
  }

  return { content };
};
