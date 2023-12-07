import { useSelector } from "react-redux";
import { IGlobalState } from "@/store/reducers";

const ScoreCard = () => {
  const score = useSelector((state: IGlobalState) => state.score);
  const prev_scores = useSelector((state: IGlobalState) => state.prev_scores);
  const max_of_prev_scores = prev_scores.reduce((a, b) => Math.max(a, b), 0);
  return (
    <div>
      <div className="my-5 text-xl font-bold">
        Your High Score: {max_of_prev_scores}
      </div>
      <div className="my-5 text-xl font-bold">Current Score: {score}</div>
    </div>
  );
};

export default ScoreCard;
