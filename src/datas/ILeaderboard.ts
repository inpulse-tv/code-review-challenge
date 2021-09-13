export interface ILeaderboard {
  [name: string]: string | number | null;
  email: string | null;
  score: number;
  millisecs: number;
  time: string;
}
