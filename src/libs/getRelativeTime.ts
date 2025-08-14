export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "방금 전 편집";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전 편집`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전 편집`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전 편집`;
  } else {
    return dateObj.toLocaleDateString("ko-KR");
  }
};
