export interface ToggleLikeResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    likeCount: number;
    liked: boolean;
  };
}