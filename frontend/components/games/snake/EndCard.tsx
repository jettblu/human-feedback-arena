import { IGlobalState } from "@/store/reducers";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function EndCard() {
  const experimentId = useSelector((state: IGlobalState) => state.experimentId);
  return (
    <div className="flex flex-col px-4 py-2 border-2 border-yellow-500 max-w-xl">
      <h2 className="text-2xl font-bold text-left text-yellow-500">
        Game Over
      </h2>
      <ul className="list-disc list-inside text-md text-red-500">
        <li className="my-2">
          ✅ Your training observations have been recorded.
        </li>
        <li className="my-2">
          🪄 Our training wizard is teaching an RL agent to play the game based
          on your playing style.
        </li>
        <li className="my-2">
          🔋 You can view the training progress on the experiment board. Your
          agent should be ready in ten minutes.
        </li>
      </ul>

      <div className="text-center bg-green-500 hover:bg-green-600 transition duration-100 text-white font-bold py-2 px-4 rounded my-6 text-xl hover:cursor-pointer">
        <Link href={`/experiments/${experimentId}`}>View Experiment Page</Link>
      </div>
    </div>
  );
}
