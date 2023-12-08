export type Observation = {
  state: boolean[];
  action: Action;
  reward: number;
  nextState: boolean[];
};

export type Action = "left" | "right" | "straight" | "none";

export type Direction = "up" | "down" | "left" | "right";

export interface IExperimentSummary {
  name: string;
  num_responses: number;
  started_at: string;
  pretty_time_elapsed: string;
}

// based on the following django model
// class Experiment(models.Model):
// id = models.UUIDField(
//     primary_key=True,
//     default=uuid.uuid4,
//     editable=False)
// created_at = models.DateTimeField(
//     'date created', auto_now_add=True, db_index=True)
// updated_at = models.DateTimeField(auto_now=True, db_index=True)
// name = models.TextField('name of the experiment', db_index=True)
// description = models.TextField(
//     'description of the experiment', db_index=True)
// agent_rl_playing_url = models.TextField(
//     'url of the rl agent in action after fine tuning', db_index=True, blank=True, null=True)
// agent_immitation_playing_url = models.TextField(
//     'url of the agent in action after immitation', db_index=True, blank=True, null=True)
// training_data_url = models.TextField(
//     'url of the training data', db_index=True, blank=True, null=True)
// training_statistics_graph_url = models.TextField(
//     'url of the training statistics graph which depeicts the avg score per round', db_index=True, blank=True, null=True)
// rl_human_fusion_score = models.FloatField(
//     'rl score after averaging over ten games', db_index=True, blank=True, null=True)

// immitation_score = models.FloatField(
//     'immitation score after averaging over ten games', db_index=True, blank=True, null=True)
// is_training_data_uploaded = models.BooleanField(
//     'is training data uploaded', default=False)
// is_done_training = models.BooleanField(
//     'is done training', default=False)
export type IExperiment = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  agent_rl_playing_url: string;
  agent_immitation_playing_url: string;
  training_data_url: string;
  training_statistics_graph_url: string;
  rl_human_fusion_score: number;
  immitation_score: number;
  is_training_data_uploaded: boolean;
  is_done_training: boolean;
};
