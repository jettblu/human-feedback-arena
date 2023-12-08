// this should display a list of experiments

import { getAllExperiments } from "@/helpers/requests";
import { IExperiment } from "@/types";

export default async function Page() {
  const experiments = await getAllExperiments();
  return (
    <div>
      <h1 className="text-xl text-red-500">Leaderboard</h1>
      <div className="flex flex-col space-y-4">
        {experiments && experiments.length === 0 && (
          <div className="text-center text-xl text-gray-400">
            No experiments yet!
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
    <div className="bg-gray-800/20 flex flex-row py-2 px-1">
      <div className="bg-blue h-full w-4 mr-2">
        {experiment.rl_human_fusion_score}
      </div>
      <h2 className="text-lg text-yellow-500">{experiment.name}</h2>
      <div className="flex-expand">
        <div className="absolute right-2">
          <p className="text-xs text-gray-400">{experiment.created_at}</p>
        </div>
      </div>
    </div>
  );
}
