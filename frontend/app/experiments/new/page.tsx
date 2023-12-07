"use client";

import CanvasBoard from "@/components/games/snake/Board";
import Link from "next/link";
import { Provider } from "react-redux";
import store from "@/store";
import ScoreCard from "@/components/games/snake/Scorecard";
import { useState } from "react";
import Instruction from "@/components/games/snake/Instructions";

// import snake game from the phaser lib
enum Task {
  introduction = "introduction",
  training = "training",
  done_training = "done_training",
}

export default function Home() {
  const [task_human, set_task_human] = useState<Task>(Task.introduction);
  function handleGameEnd() {
    set_task_human(Task.done_training);
  }
  function habndleDoneWithIntro() {
    set_task_human(Task.training);
  }
  return (
    <main className="flex min-h-screen flex-col p-8 mt-8">
      <div className="max-w-5xl mx-auto w-full">
        <Provider store={store}>
          {task_human === Task.introduction && (
            <div className="mx-auto w-fit">
              <Instruction onBegin={habndleDoneWithIntro} />
              {/* link back home here */}
              <div className="w-fit mt-8 mx-auto">
                <Link
                  href="/"
                  className="text-md hover:underline hover:text-blue-600 transition duration-100 text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
          {task_human === Task.training && (
            <div>
              {/* link back home here */}
              <Link
                href="/"
                className="text-md hover:underline hover:text-blue-600 transition duration-100"
              >
                Back to Home
              </Link>
              <h1 className="text-md font-bold text-left text-gray-400 bg-yellow-500/30 w-fit my-2">
                Training Session
              </h1>
              <h1 className="text-4xl font-bold text-left text-green-500">
                Snake Game
              </h1>
              <p className={`text-md text-left mb-4`}>
                Train the snake to eat the food. The snake should avoid hitting
                the walls and itself. Try to replicate the slithering pattern of
                a real snake, when possible.
              </p>
              <CanvasBoard height={600} width={1000} />
              <ScoreCard />
            </div>
          )}
        </Provider>
      </div>
    </main>
  );
}
