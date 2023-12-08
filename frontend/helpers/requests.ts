import { IExperiment, IExperimentSummary, Observation } from "@/types";
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getExperimentSummary(
  experiment_name: string
): Promise<IExperimentSummary | null> {
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

export async function getExperiment(
  experiment_id: string
): Promise<IExperiment | null> {
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  // fetch the experiment data
  try {
    const full_url = `${backend_url}/api/experiment/${experiment_id}`;
    const res: Response = await fetch(full_url, {
      method: "GET",
    });
    const experiment: IExperiment = await res.json();
    return experiment;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function createExperiment(
  experiment_name: string,
  experiment_description: string
): Promise<IExperiment | null> {
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  // fetch the experiment data
  try {
    const full_url = `${backend_url}/api/experiments/`;
    const res: Response = await fetch(full_url, {
      method: "POST",
      // should be json content header
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: experiment_name,
        description: experiment_description,
      }),
    });
    const experiment: IExperiment = await res.json();
    return experiment;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getAllExperiments(): Promise<IExperiment[] | null> {
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  // fetch the experiment data
  try {
    const full_url = `${backend_url}/api/experiments`;
    const res: Response = await fetch(full_url, {
      method: "GET",
    });
    const experiment: IExperiment[] = await res.json();
    return experiment;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function uploadTrainingData(
  experiment_id: string,
  training_data: Observation[]
): Promise<boolean> {
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  // fetch the experiment data
  try {
    const full_url = `${backend_url}/api/experiment/${experiment_id}/uploadTrainingData/`;
    console.log("training data", training_data);
    // json stringify the training data
    const res: Response = await fetch(full_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ training_data: training_data }),
    });
    const experiment: IExperiment = await res.json();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
