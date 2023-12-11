"use client";

import CanvasBoard from "@/components/games/snake/Board";
import Link from "next/link";
import { useDispatch, Provider, useSelector } from "react-redux";
import store from "@/store";
import ScoreCard from "@/components/games/snake/Scorecard";
import { useEffect, useState } from "react";
import { IGlobalState } from "@/store/reducers";
import { uploadTrainingData } from "@/helpers/requests";
import EndCard from "@/components/games/snake/EndCard";
import CreateExperimentFullPager from "@/components/games/snake/CreateExperimentFullPager";
import { resetGame } from "@/store/actions";

// import snake game from the phaser lib
enum Task {
  introduction = "introduction",
  training = "training",
  done_training = "done_training",
}

export default function Home() {
  const [task_human, set_task_human] = useState<Task>(Task.introduction);
  async function handleGameEnd() {
    set_task_human(Task.done_training);
  }
  function habndleDoneWithIntro() {
    set_task_human(Task.training);
  }
  // get screen width and height
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [screenHeight, setScreenHeight] = useState<number>(0);
  const [screenBigEnough, setScreenBigEnough] = useState<boolean>(true);
  // const backgroundMusic = new Audio("/snake/background-music.mp3");
  // backgroundMusic.loop = false;

  // update screen width and height on resize
  useEffect(() => {
    setScreenWidth(window.innerWidth);
    setScreenHeight(window.innerHeight);
  }, []);

  // listen for resize events
  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // check if screen is big enough
  useEffect(() => {
    if (screenWidth < 1000 || screenHeight < 600) {
      setScreenBigEnough(false);
    } else {
      setScreenBigEnough(true);
    }
  }, [screenWidth, screenHeight]);

  useEffect(() => {
    // if (task_human === Task.training) {
    //   backgroundMusic.play();
    // }
  }, [task_human]);

  return (
    <main className="flex min-h-screen flex-col px-2 mt-8">
      <div className="max-w-5xl mx-auto w-full">
        {!screenBigEnough && task_human === Task.introduction && (
          <div className="flex flex-col items-center justify-center min-h-screen max-w-5xl mx-auto lg:-mt-32">
            <h1 className="text-4xl font-bold text-left text-green-500">
              Snake Game
            </h1>
            <p className={`text-md text-left mb-3`}>
              Please make your browser window larger to play the game.
            </p>
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
        <Provider store={store}>
          {screenBigEnough && task_human === Task.introduction && (
            <div className="mx-auto w-fit">
              {/* <Instruction onBegin={habndleDoneWithIntro} /> */}
              {/* form with option to input experiment name and description in retro style */}
              <div className="flex flex-col items-center justify-center min-h-screen max-w-5xl mx-auto lg:-mt-32">
                <CreateExperimentFullPager onBegin={habndleDoneWithIntro} />
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
          {task_human === Task.done_training && (
            <div className="mx-auto w-fit">
              <div className="flex flex-col items-center justify-center min-h-screen max-w-5xl mx-auto lg:-mt-32">
                <EndCard />{" "}
              </div>
            </div>
          )}
        </Provider>
      </div>
    </main>
  );
}

function TrainingBoard(params: { handleGameEnd: () => void }) {
  const handleGameEnd = params.handleGameEnd;
  const score = useSelector((state: IGlobalState) => state.score);
  const lastReward = useSelector((state: IGlobalState) => state.lastReward);
  const experimentId = useSelector((state: IGlobalState) => state.experimentId);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isCollectionComplete, setIsCollectionComplete] =
    useState<boolean>(false);
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (experimentId == null) {
      console.error("experimentId is null. unable to upload training data.");
      return;
    }
    if (totalObservations == observationsRequired) {
      setIsCollectionComplete(true);
      dispatch(resetGame());
      // get collection time in seconds
      const collection_time_seconds = (Date.now() - startTime) / 1000;
      // pause a second before uploading data and ending game
      const upload_result = uploadTrainingData(
        experimentId,
        collection_time_seconds,
        observations
      );
      console.log("upload_result", upload_result);
      setTimeout(async () => {
        handleGameEnd();
      }, 1500);
    }
  }, [totalObservations]);

  useEffect(() => {
    console.log("totalObservations", totalObservations);
  }, [totalObservations]);

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

  useEffect(() => {
    if (lastReward == -1) {
      gameOver.play();
    }
  }, [lastReward]);

  return (
    <div className="relative">
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
        You can move the snake with the arrow keys. You should follow your
        playing style while eating the food and avoiding walls. Your
        observations will be used to train an autonomous agent to play the game.
      </p>
      {isCollectionComplete && (
        <div className="absolute top-[40%] right-[30%] text-2xl text-green-500 bg-blue-400/80 w-fit px-2 py-2">
          <p className="">Training Complete!</p>
          <p className="text-sm text-gray-400">Uploading training data...</p>
        </div>
      )}
      <div className="w-full px-2">
        {/* progress bar that shows how many observations we have made */}
        <div className="w-full h-8 bg-gray-300 mb-4 relative">
          <div
            className="h-full bg-green-500"
            style={{
              width: `${
                ((isCollectionComplete
                  ? observationsRequired
                  : totalObservations) /
                  observationsRequired) *
                100
              }%`,
            }}
          />
          <div className="text-center text-gray-600 text-xs absolute top-2 left-8">
            {totalObservations}/{observationsRequired} observations
          </div>
        </div>
      </div>
      <CanvasBoard height={600} width={1000} />
      <ScoreCard />
      {/* status indicator */}
      <div className="flex flex-row space-x-4 mt-6">
        <p className="text-md text-left font-semibold text-gray-400">
          Connected to server:
        </p>
        <div
          className={`w-4 h-4 ${
            experimentId ? "bg-green-500" : "bg-red-500"
          } my-auto`}
        />
      </div>
    </div>
  );
}
