// get slug from url and fetch data from api

import { getExperiment } from "@/helpers/requests";
import { IExperiment } from "@/types";
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
  const experiment_id = params.slug;

  const experiment = await getExperiment(experiment_id);
  return (
    <div className="max-w-5xl mx-auto mt-16">
      <Link
        href="/"
        className="text-md hover:underline hover:text-blue-600 transition duration-100"
      >
        Back to Home
      </Link>
      {experiment && (
        <DisplayExperiment experiment={experiment} key={experiment.id} />
      )}
      {!experiment && (
        <div className="text-center text-xl text-gray-400">
          No experiment found! 💔
        </div>
      )}
    </div>
  );
}

function DisplayExperiment(params: { experiment: IExperiment }) {
  const experiment = params.experiment;
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
    </div>
  );
}
