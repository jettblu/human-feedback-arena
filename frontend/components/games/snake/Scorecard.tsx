import { useSelector } from "react-redux";
import { IGlobalState } from "@/store/reducers";

const ScoreCard = () => {
  const score = useSelector((state: IGlobalState) => state.score);
  const personalBest = useSelector((state: IGlobalState) => state.personalBest);
  return (
    <div>
      <div className="my-5 text-xl font-bold">
        Your High Score: {personalBest}
      </div>
      <div className="my-5 text-xl font-bold">Current Score: {score}</div>
    </div>
  );
};

export default ScoreCard;
