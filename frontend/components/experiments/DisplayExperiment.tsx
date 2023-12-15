import { IExperiment } from "@/types";
import Image from "next/image";
import TrainingPendingView from "./TrainingPending";
import { timeStringFromSeconds } from "@/helpers/data";
import exp from "constants";
import Link from "next/link";
import Plot from "./Plot";
import { getExperiment } from "@/helpers/requests";

export default async function DisplayExperiment(params: {
  experiment_id: string;
}) {
  const { experiment_id } = params;
  const experiment = await getExperiment(experiment_id);
  return (
    <div>
      {experiment && (
        <DisplayExperimentView experiment={experiment} key={experiment.id} />
      )}
      {!experiment && (
        <div className="text-center text-xl text-gray-400">
          No experiment found! 💔
        </div>
      )}
    </div>
  );
}

export async function DisplayExperimentView(params: {
  experiment: IExperiment;
}) {
  const { experiment } = params;
  const timeString = timeStringFromSeconds(experiment.collection_time_seconds);

  return (
    <div>
      <div className="flex flex-row py-2">
        <h2 className="text-2xl text-red-500">{experiment.name}</h2>
        <div className="flex-grow">
          <p className="text-xs text-gray-400 text-right">
            {experiment.created_at}
          </p>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <h3 className="text-md text-yellow-500">Description</h3>
        <div className="text-left text-lg text-gray-400">
          {experiment.description}
        </div>
      </div>
      {!experiment.is_training_data_uploaded && (
        <p className="text-gray-200">
          This experiment is still being trained by a human. Check back later!
        </p>
      )}
      {experiment.is_training_data_uploaded && (
        <div className="flex flex-col space-y-3 mt-6 mb-4">
          <h3 className="text-md text-yellow-500">Training Stats</h3>
          <p className="text-lg text-gray-400">
            Observation Collection Time:{" "}
            <span className="text-gray-100">{timeString}</span>
          </p>
          <p className="text-lg text-gray-400">
            Total Observations:
            <span className="text-gray-100">
              {experiment.observation_count}
            </span>
          </p>
          {experiment.training_data_url && (
            <Link
              href={experiment.training_data_url}
              className="text-lg text-blue-600 hover:underline hover:text-blue-500"
              download={experiment.name + ".json"}
            >
              Download Training Data
            </Link>
          )}
        </div>
      )}
      {experiment.is_done_training && <CompleteView experiment={experiment} />}
      {!experiment.is_done_training && experiment.is_training_data_uploaded && (
        <TrainingPendingView experiment={experiment} />
      )}
    </div>
  );
}

function CompleteView(params: { experiment: IExperiment }) {
  const { experiment } = params;

  return (
    <div>
      <div className="flex flex-col space-y-3 my-4">
        <h3 className="text-md text-yellow-500">
          Finetuned Reinforcement Agent
        </h3>
        <p className="text-lg text-gray-200">
          Average Score on Ten Games:{" "}
          <span className="text-yellow-500">
            {experiment.rl_human_fusion_score}
          </span>
        </p>
        <p className="text-lg text-gray-200">
          This autonomous agent was trained for two hundred iterations using
          deep q learning and experience replay. Observations of human expert
          gameplay were then used to finetune the agent's performance.
        </p>
        <Image
          src={experiment.agent_rl_playing_url}
          alt="Fintuned reinforcement agent playing the game of snake"
          className="w-full h-full ring-2 ring-blue-500/90 my-3"
          width={500}
          height={500}
        />
        {experiment.rl_chart_data && (
          <Plot
            data={experiment.rl_chart_data}
            description="This is a chart showing the agent's score after each epoch of finetuning."
            maxValue={100}
          />
        )}
      </div>
      <div className="flex flex-col space-y-3 my-4">
        <h3 className="text-md text-yellow-500">Immitation Agent</h3>
        <p className="text-lg text-gray-200">
          Average Score on Ten Games:{" "}
          <span className="text-yellow-500">{experiment.immitation_score}</span>
        </p>
        <p className="text-lg text-gray-200">
          This autonomous agent is trained to mimic the original human player.
          Human state-action observations were used as training data for a
          policy network that predicts the next action given the current state.
        </p>
        <Image
          src={experiment.behavior_cloning_agent_playing_url}
          alt="Fintuned reinforcement agent playing the game of snake"
          className="w-full h-full ring-2 ring-blue-500/90 my-3"
          width={500}
          height={500}
        />
        {experiment.behavior_cloning_chart_data && (
          <Plot
            data={experiment.behavior_cloning_chart_data}
            description="This is a chart showing the validation accuracy after each epoch of training."
            maxValue={1}
          />
        )}
      </div>
      <div className="flex flex-col space-y-3 my-4">
        <h3 className="text-md text-yellow-500">Inverse Q Learning Agent</h3>
        <p className="text-lg text-gray-200">
          Average Score on Ten Games:{" "}
          <span className="text-yellow-500">{experiment.cql_score}</span>
        </p>
        <p className="text-lg text-gray-200">
          This agent uses inverse q learning to estimate the q values for a
          given state. All training is done completely offline using{" "}
          {experiment.observation_count} observations of human gamplay.
        </p>
        <Image
          src={experiment.agent_cql_playing_url}
          alt="Fintuned reinforcement agent playing the game of snake"
          className="w-full h-full ring-2 ring-blue-500/90 my-3"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
