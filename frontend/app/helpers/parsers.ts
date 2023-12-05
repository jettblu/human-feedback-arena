import { IExperimentSummary } from "./types";

/*

    This method parses the experiment summary response as returned by the backend. 
    
    */
export async function parseExperimentSummary(
  response: Response
): Promise<IExperimentSummary> {
  const experimentSummary = await response.json();
  return experimentSummary;
}
