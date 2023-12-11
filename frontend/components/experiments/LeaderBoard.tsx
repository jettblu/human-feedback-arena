// this should display a list of experiments

import { getAllExperiments } from "@/helpers/requests";
import { unstable_noStore as noStore } from "next/cache";
import { IExperiment } from "@/types";
import Link from "next/link";

export async function LeaderBoard() {
  // make a dynamic request to get all experiments... we don't want to cache this
  noStore();
  let experiments = await getAllExperiments();
  if (experiments) {
    experiments.sort((a, b) => {
      return b.rl_human_fusion_score - a.rl_human_fusion_score;
    });
    // filter out experiments that are not complete
    experiments = experiments.filter((experiment) => {
      return experiment.is_done_training;
    });
  }
  return (
    <div className="w-full">
      <h1 className="text-xl text-red-500">Experiment Leaderboard</h1>
      <div className="flex flex-col space-y-4 w-full">
        {experiments && experiments.length === 0 && (
          <div className="text-center text-xl text-gray-400">
            No experiments yet!
          </div>
        )}
        {!experiments && (
          <div className="text-center text-xl text-gray-400">
            Loading experiments...
          </div>
        )}
        {experiments &&
          experiments.length > 0 &&
          experiments.map((experiment) => (
            <ListItemExperiment experiment={experiment} key={experiment.id} />
          ))}
      </div>
    </div>
  );
}

function ListItemExperiment(params: { experiment: IExperiment }) {
  const experiment = params.experiment;
  return (
    <div className="bg-gray-800/20 flex flex-row py-2">
      <div className="bg-blue-500 h-full px-2 mr-3 my-auto">
        {experiment.rl_human_fusion_score
          ? experiment.rl_human_fusion_score
          : "?"}
      </div>
      <Link href={`/experiments/${experiment.id}`}>
        <h2 className="text-lg text-gray-500 hover:cursor-pointer hover:underline my-auto">
          {experiment.name}
        </h2>
      </Link>
      <div className="flex-grow relative">
        <div className="">
          <p className="text-xs text-gray-400 text-right">
            {experiment.created_at}
          </p>
        </div>
      </div>
    </div>
  );
}
