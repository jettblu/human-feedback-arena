// this page will include a short descriptor of the base rl agent trained for two hundred episodes
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto mt-20">
      <Link
        href="/"
        className="text-md hover:underline hover:text-blue-600 transition duration-100"
      >
        Back to Home
      </Link>
      <h1 className="text-3xl text-red-500">Pure Autonomous Snake Agent</h1>
      <p className="text-xl text-gray-500">
        This agent is used as a baseline for finetuning given human expert game
        play. The agent was trained for two hundred episodes using a deep q
        network and experience replay.
      </p>
      <div className="flex flex-col space-y-1">
        <h3 className="text-md text-yellow-500">Game Play</h3>
        <Image
          src="/experiments/snake/pure_rl_200_gameplay.gif"
          width={300}
          height={300}
          className="w-full h-full"
          alt={
            "Autonomous agent playing a game of snake. The agent achieves a score of 37."
          }
        />
      </div>
      <p className="text-xl text-white">
        The agent achieves a score of 46. The agent is able to avoid walls and
        eat food. However, the agent exhibits some strange behavior. For
        example, notice how the agent is inneficient with some movement,
        wrapping around itself before proceeding with its search for food.
      </p>
      <div className="flex flex-col space-y-1 mt-4">
        <h3 className="text-md text-yellow-500">Training Scores</h3>
        <Image
          src="/experiments/snake/pure_rl_200_iterations.png"
          width={300}
          height={300}
          alt={"Training scores for the pure autonomous agent."}
          className="w-full h-full"
        />
      </div>
      <p className="text-xl text-white">
        Initial training episodes result in low scores as the agent explores
        policies. There is a significant jump in performance around the one
        hundredth episode. Performance improvements become progressively smaller
        as the agent approaches the two hundredth episode.
      </p>
    </div>
  );
}
