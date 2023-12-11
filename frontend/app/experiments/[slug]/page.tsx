// get slug from url and fetch data from api

import DisplayExperiment from "@/components/experiments/DisplayExperiment";
import { getExperiment } from "@/helpers/requests";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
  noStore();
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
