import { api } from "./api";
import type { CommentListResponse } from "../types/comment";

// 댓글 목록 조회
export const getComments = async (
  reportId: number,
): Promise<CommentListResponse> => {
  const response = await api.get<CommentListResponse>(
    `/api/reports/${reportId}/comments`,
  );

  return response.data;
};

export const createComment = async (
  reportId: number,
  content: string,
): Promise<void> => {
  await api.post(`/api/reports/${reportId}/comments`, {
    content,
  });
};

// 본인이 작성한 댓글 삭제
export const deleteComment = async (
  reportId: number,
  commentId: number,
): Promise<void> => {
  await api.delete(
    `/api/reports/${reportId}/comments/${commentId}`,
  );
};