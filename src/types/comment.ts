export interface Comment {
  commentId: number;
  anonymousName: string;
  content: string;
  createdAt: string;
  myComment: boolean;
}

export interface CommentListResponse {
  success: boolean;
  code: number;
  message: string;
  data: Comment[];
}