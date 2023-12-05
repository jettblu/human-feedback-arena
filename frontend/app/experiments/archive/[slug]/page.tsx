import getExperimentSummary from "@/app/helpers/requests";
import { IExperimentSummary } from "@/app/helpers/types";

export default async function Home({ params }: { params: { slug: string } }) {
  let experiment_name = params.slug;
  // remove %20 from experiment_name if it exists
  const experiment_name_regex = /%20/g;
  experiment_name = experiment_name.replace(experiment_name_regex, " ");
  const experiment_summary: IExperimentSummary | null =
    await getExperimentSummary(experiment_name);

  return (
    <main className="flex min-h-screen flex-col p-8">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-left text-gray-400/80">
          {experiment_name}
        </h1>
        <h1 className="text-4xl font-bold text-left">Historical Stats</h1>
        <p className="text-xl text-left">
          Historical stats from the {experiment_name} experiment.
        </p>
        {!experiment_summary && (
          <p className="text-xl text-left">No data found.</p>
        )}
        {experiment_summary && (
          <ExperimentSummaryTable experiment_summary={experiment_summary} />
        )}
      </div>
    </main>
  );
}

function ExperimentSummaryTable({
  experiment_summary,
}: {
  experiment_summary: IExperimentSummary;
}) {
  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th>Name</th>
          <th># of Responses</th>
          <th>Date Started</th>
          <th>Time Elapsed</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{experiment_summary.name}</td>
          <td>{experiment_summary.num_responses}</td>
          <td>{experiment_summary.started_at}</td>
          <td>{experiment_summary.pretty_time_elapsed}</td>
        </tr>
      </tbody>
    </table>
  );
}
