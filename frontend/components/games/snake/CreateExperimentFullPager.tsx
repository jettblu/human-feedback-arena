import { useEffect, useState } from "react";
import {
  clearAllGameData,
  setEnforceDataBalance,
  setExperimentDescription,
  setExperimentId,
  setExperimentName,
  setObservationRequirement,
} from "@/store/actions";
import { createExperiment } from "@/helpers/requests";
import { useDispatch, useSelector } from "react-redux";
import { getExpectedCollectionTimeString } from "@/helpers/data";
import {
  DESIRED_NUMBER_OF_OBSERVATIONS,
  MAX_OBSERVATION_REQUIREMENT,
  MIN_OBSERVATION_REQUIREMENT,
} from "@/helpers/constants";

export interface IInstructionProps {
  onBegin: () => void;
}

export default function CreateExperimentCard(props: IInstructionProps) {
  const dispatch = useDispatch();
  const [experimentName, setExperimentName] = useState<string>("");
  const [experimentDescription, setExperimentDescription] =
    useState<string>("");
  const [observationsRequired, setObservationsRequired] = useState<number>(
    DESIRED_NUMBER_OF_OBSERVATIONS
  );
  const [dataBalanceEnforced, setDataBalanceEnforced] =
    useState<boolean>(false);
  const [expectedCollectionTime, setExpectedCollectionTime] =
    useState<string>("5 minutes");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const expectedMinutes = getExpectedCollectionTimeString(
      observationsRequired,
      dataBalanceEnforced
    );
    setExpectedCollectionTime(expectedMinutes);
  }, [observationsRequired, dataBalanceEnforced]);

  async function handleNext() {
    if (experimentName === "" || experimentDescription === "") {
      setErrorMsg("Please fill out all fields");
      return;
    } else {
      setErrorMsg(null);
    }
    if (observationsRequired < 1) {
      setErrorMsg("Please specify a positive number of observations required");
      return;
    }
    if (observationsRequired > MAX_OBSERVATION_REQUIREMENT) {
      setErrorMsg(
        `Please specify a number of observations required less than ${MAX_OBSERVATION_REQUIREMENT}. This is currently a limit due to client side game rendering and will be removed in the future.`
      );
    }
    if (observationsRequired < MIN_OBSERVATION_REQUIREMENT) {
      setErrorMsg(
        `Please specify a number of observations required greater than ${MIN_OBSERVATION_REQUIREMENT}.`
      );
    }
    const experiment_upload_result = await createExperiment(
      experimentName,
      experimentDescription
    );
    console.log("experiment_upload_result");
    console.log(experiment_upload_result);
    if (!experiment_upload_result || experiment_upload_result.id == null) {
      setErrorMsg("Something went wrong. Please try again.");
      return;
    }
    dispatch(setExperimentId(experiment_upload_result.id));
    dispatch(setObservationRequirement(observationsRequired));
    dispatch(setEnforceDataBalance(dataBalanceEnforced));
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
    <div className="flex flex-col md:flex-row max-w-9xl">
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold text-left text-yellow-500">
          Create Snake Experiment 🐍
        </h2>
        <p className="text-md text-red-500">
          You will be playing a game of snake. Your playing style will be used
          to train an autonomous agent. Describe your playing style below.
        </p>

        <p className="text-md text-red-500 mt-6">
          Based on your settings, we expect this experiment to take{" "}
          <span className="font-bold text-blue-500">
            {expectedCollectionTime}
          </span>
          .
        </p>
      </div>
      <div className="md:w-1/2 flex-grow flex-col">
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
          {/* allow user to specify number of observations required */}
          <div className="flex flex-col">
            <div className="flex flex-row">
              <h3 className="text-sm text-yellow-500">Observations Required</h3>
              <div className="flex flex-grow relative">
                <p
                  className="text-sm text-gray-400 ml-2 float-right underline absolute right-0 hover:cursor-pointer"
                  onClick={() =>
                    setObservationsRequired(DESIRED_NUMBER_OF_OBSERVATIONS)
                  }
                >
                  Auto
                </p>
              </div>
            </div>
          </div>
          <input
            className="border-2 border-gray-400 rounded-md p-2 bg-gray-500 h-16 ring-1 ring-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            type="number"
            value={observationsRequired}
            onChange={(e) => setObservationsRequired(parseInt(e.target.value))}
          ></input>
        </div>
        {/* allow user to specify if data balance is enforced */}
        <div className="flex flex-col space-y-1">
          <div className="flex flex-row">
            <h3 className="text-sm text-yellow-500">Data Balance Enforced</h3>
          </div>
          <div className="flex flex-row space-x-4">
            <div
              className={`${
                !dataBalanceEnforced ? "bg-red-500" : "bg-red-500/10"
              } hover:bg-red-600 transition duration-100 text-white font-bold py-2 px-4 rounded my-6 text-xl hover:cursor-pointer`}
              onClick={() => setDataBalanceEnforced(false)}
            >
              <p className="text-sm text-gray-400 ml-2 float-right underline hover:cursor-pointer">
                No
              </p>
            </div>
            <div
              className={`${
                dataBalanceEnforced ? "bg-green-500" : "bg-green-500/10"
              } hover:bg-green-600 transition duration-100 text-white font-bold py-2 px-4 rounded my-6 text-xl hover:cursor-pointer`}
              onClick={() => setDataBalanceEnforced(true)}
            >
              <p className="text-sm text-gray-400 ml-2 float-right underline hover:cursor-pointer">
                Yes
              </p>
            </div>
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
    </div>
  );
}
