import { ILeaderboard } from "../../datas/ILeaderboard";
import Display from "../Display";
import { Quiz } from "../quiz/Quiz";

export interface IProps {
  quizData: ILeaderboard[];
  display: Display;
  quizRef: React.MutableRefObject<Quiz>;
}
