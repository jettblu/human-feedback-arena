"use client";

import CanvasBoard from "@/components/games/snake/Board";
import Link from "next/link";
import { useDispatch, Provider, useSelector } from "react-redux";
import store from "@/store";
import ScoreCard from "@/components/games/snake/Scorecard";
import { useEffect, useState } from "react";
import { IGlobalState } from "@/store/reducers";
import { getObservation } from "@/helpers/data";
import { BOARD_HEIGHT, BOARD_WIDTH } from "@/helpers/constants";
import { reverseDirection } from "@/utils";
import { Direction } from "@/types";
import { addObservation } from "@/store/actions";
import CreateExperimentCard from "@/components/games/snake/CreateExperimentCard";

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
    <main className="flex min-h-screen flex-col px-2 mt-8">
      <div className="max-w-5xl mx-auto w-full">
        <Provider store={store}>
          {task_human === Task.introduction && (
            <div className="mx-auto w-fit">
              {/* <Instruction onBegin={habndleDoneWithIntro} /> */}
              {/* form with option to input experiment name and description in retro style */}
              <div className="flex flex-col items-center justify-center min-h-screen max-w-5xl mx-auto lg:-mt-32">
                <CreateExperimentCard onBegin={habndleDoneWithIntro} />
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

  // load audio clips for game
  const consumedFood = new Audio("/snake/collect.mp3");
  const gameOver = new Audio("/snake/game_over.mp3");
  const gamePlay = new Audio("/snake/gameplay.mp3");
  const backgroundMusic = new Audio("/snake/background-music.mp3");
  gamePlay.loop = true;
  backgroundMusic.loop = true;

  // capture reward changing observations
  useEffect(() => {
    if ((lastReward != 1 && lastReward != -1) || !snake || !lastSnake) {
      return;
    }

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
    // every 25 moves, capture the observation
    if (counter % 25 == 0 && counter != 0 && snake && lastSnake) {
      console.log("Gathering scheduled observation");
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

  useEffect(() => {
    if (score > 0) {
      consumedFood.play();
    }
  }, [score]);

  useEffect(() => {
    if (lastReward == -1) {
      gameOver.play();
    }
  }, [lastReward]);

  return (
    <div className="">
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
      <p className={`text-md text-left mb-3`}>
        The snake is learning to play based on your playing style. You can move
        the snake with the arrow keys. You should follow your playing style
        while eating the food and avoiding walls.
      </p>
      <div className="w-full px-2">
        {/* progress bar that shows how many observations we have made */}
        <div className="w-full h-8 bg-gray-300 mb-4 relative">
          <div
            className="h-full bg-green-500"
            style={{
              width: `${(totalObservations / observationsRequired) * 100}%`,
            }}
          />
          <div className="text-center text-gray-600 text-xs absolute top-2 left-8">
            {totalObservations}/{observationsRequired} observations
          </div>
        </div>
      </div>
      <CanvasBoard height={600} width={1000} />
      <ScoreCard />
    </div>
  );
}
