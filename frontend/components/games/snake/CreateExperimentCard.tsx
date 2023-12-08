import { useState } from "react";
import {
  clearAllGameData,
  setExperimentDescription,
  setExperimentName,
} from "@/store/actions";

export interface IInstructionProps {
  onBegin: () => void;
}

export default function CreateExperimentCard(props: IInstructionProps) {
  const [experimentName, setExperimentName] = useState<string>("");
  const [experimentDescription, setExperimentDescription] =
    useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  function handleNext() {
    if (experimentName === "" || experimentDescription === "") {
      setErrorMsg("Please fill out all fields");
      return;
    } else {
      setErrorMsg(null);
    }
    // make sure we have a clean slate
    clearAllGameData();
    // set experiment name and description
    setExperimentName(experimentName);
    setExperimentDescription(experimentDescription);
    props.onBegin();
  }
  function generateDescription() {
    const newDescription = `I try to slither like a real snake when possible. I also try to circle my prey before eating it.`;
    setExperimentDescription(newDescription);
  }
  function generateName() {
    const random = Math.floor(Math.random() * 1000);
    const newName = `Slithering Snake ` + random;
    setExperimentName(newName);
  }
  return (
    <div className="flex flex-col px-4 py-2 border-2 border-yellow-500 max-w-xl">
      <h2 className="text-2xl font-bold text-left text-yellow-500">
        Create Snake Experiment 🐍
      </h2>
      <p className="text-md text-red-500">
        You will be playing a game of snake. Your playing style will be used to
        train an autonomous agent. Describe your playing style below.
      </p>

      <div className="flex flex-col space-y-4 mt-6 mb-4">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <h3 className="text-sm text-yellow-500">Experiment Name</h3>
            <div className="flex flex-grow relative">
              <p
                className="text-sm text-gray-400 ml-2 float-right underline absolute right-0 hover:cursor-pointer"
                onClick={generateName}
              >
                Auto
              </p>
            </div>
          </div>
          <textarea
            className="border-2 border-gray-400 rounded-md p-2 bg-gray-500 h-16 ring-1 ring-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Slithering Snake"
            value={experimentName}
            onChange={(e) => setExperimentName(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col space-y-1">
          <div className="flex flex-row">
            <h3 className="text-sm text-yellow-500">
              Describe your playing style
            </h3>
            <div className="flex flex-grow relative">
              <p
                className="text-sm text-gray-400 ml-2 float-right underline absolute right-0 hover:cursor-pointer"
                onClick={generateDescription}
              >
                Auto
              </p>
            </div>
          </div>

          <textarea
            className="border-2 border-gray-400 rounded-md p-2 bg-gray-500 h-32 ring-1 ring-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="I try to circle my prey before eating it. I also slither like a real snake when possible."
            value={experimentDescription}
            onChange={(e) => setExperimentDescription(e.target.value)}
          ></textarea>
        </div>
      </div>
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      <button
        className="bg-green-500 hover:bg-green-600 transition duration-100 text-white font-bold py-2 px-4 rounded my-6 text-xl"
        onClick={handleNext}
      >
        Begin Game
      </button>
    </div>
  );
}
