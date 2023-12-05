import { IExperimentSummary } from "./types";

export default async function getExperimentSummary(
  experiment_name: string
): Promise<IExperimentSummary | null> {
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  // fetch the experiment data
  try {
    const full_url = `${backend_url}/api/experimentSummary/${experiment_name}`;
    console.log(`Fetching experiment summary from ${full_url}`);
    const res: Response = await fetch(full_url);
    const experimentSummary: IExperimentSummary = await res.json();
    if (experimentSummary.started_at == null) {
      throw new Error("Experiment not found");
    }
    return experimentSummary;
  } catch (err) {
    console.log(err);
    return null;
  }
}
