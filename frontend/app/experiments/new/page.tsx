"use client";

import CanvasBoard from "@/components/games/snake/Board";
import Link from "next/link";
import { useDispatch, Provider, useSelector } from "react-redux";
import store from "@/store";
import ScoreCard from "@/components/games/snake/Scorecard";
import { useEffect, useState } from "react";
import Instruction from "@/components/games/snake/Instructions";
import { IGlobalState } from "@/store/reducers";
import { getObservation } from "@/helpers/data";
import { BOARD_HEIGHT, BOARD_WIDTH } from "@/helpers/constants";
import { reverseDirection } from "@/utils";
import { Direction } from "@/types";
import { addObservation } from "@/store/actions";

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
            <TrainingBoard handleGameEnd={handleGameEnd} />
          )}
        </Provider>
      </div>
    </main>
  );
}

function TrainingBoard(params: { handleGameEnd: () => void }) {
  const handleGameEnd = params.handleGameEnd;
  const score = useSelector((state: IGlobalState) => state.score);
  const food = useSelector((state: IGlobalState) => state.food);
  const snake = useSelector((state: IGlobalState) => state.snake);
  const lastSnake = useSelector((state: IGlobalState) => state.lastSnake);
  const lastAction = useSelector((state: IGlobalState) => state.lastAction);
  const lastReward = useSelector((state: IGlobalState) => state.lastReward);
  const [counter, setCounter] = useState<number>(0);
  const dispatch = useDispatch();
  const disallowedDirection = useSelector(
    (state: IGlobalState) => state.disallowedDirection
  );
  const totalObservations = useSelector(
    (state: IGlobalState) => state.totalObservations
  );
  const observationsRequired = useSelector(
    (state: IGlobalState) => state.obersvationsRequired
  );
  const observations = useSelector((state: IGlobalState) => state.observations);
  // capture reward changing observations
  useEffect(() => {
    if (lastReward != 1 || lastReward != 1 || !snake || !lastSnake) {
      return;
    }
    console.log("Gathering reward observation");
    const dir: Direction = reverseDirection(lastAction);
    const newObservation = getObservation({
      food,
      reward: lastReward,
      snake,
      lastSnake,
      lastAction,
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      direction: dir,
    });
    dispatch(addObservation(newObservation));
  }, [lastReward]);

  useEffect(() => {
    if (totalObservations >= observationsRequired) {
      handleGameEnd();
    }
  }, [totalObservations]);

  useEffect(() => {
    // every 50 moves, capture the observation
    if (counter % 25 == 0 && counter != 0 && snake && lastSnake) {
      console.log("Gathering scheduled observation");
      console.log("counter", counter);
      const dir: Direction = reverseDirection(lastAction);
      const newObservation = getObservation({
        food,
        reward: lastReward,
        snake,
        lastSnake,
        lastAction,
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        direction: dir,
      });
      dispatch(addObservation(newObservation));
    }
  }, [counter]);

  useEffect(() => {
    setCounter(counter + 1);
  }, [snake]);

  // whenever last action changes, capture the observation
  useEffect(() => {
    console.log("lastAction", lastAction);
    // skip first observation
    if (totalObservations == 0 || !snake || !lastSnake) {
      return;
    }
    console.log("Gathering action observation");
    const dir: Direction = reverseDirection(lastAction);
    const newObservation = getObservation({
      food,
      reward: lastReward,
      snake,
      lastSnake,
      lastAction,
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      direction: dir,
    });
    dispatch(addObservation(newObservation));
  }, [lastAction]);

  useEffect(() => {
    console.log("totalObservations", totalObservations);
  }, [totalObservations, observations]);

  return (
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
        Train the snake to eat the food. The snake should avoid hitting the
        walls and itself. Try to replicate the slithering pattern of a real
        snake, when possible.
      </p>
      {/* progress bar that shows how many observations we have made */}
      <div className="w-full h-4 bg-gray-300">
        <div
          className="h-full bg-green-500"
          style={{
            width: `${(totalObservations / observationsRequired) * 100}%`,
          }}
        ></div>
        <CanvasBoard height={600} width={1000} />
        <ScoreCard />
      </div>
    </div>
  );
}
