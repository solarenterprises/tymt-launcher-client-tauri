export interface IReviewAPIAddReviewsRequest {
  author: string; // 6601b44c609740cfa3cebcee
  game_id: string;
  title: string;
  feedback: string;
  star: number;
  isDeleted: boolean;
  isAnonymous: boolean;
}
