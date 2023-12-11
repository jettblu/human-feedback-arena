export type Observation = {
  state: number[];
  action: Action;
  reward: number;
  nextState: number[];
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
//     id = models.UUIDField(
//         primary_key=True,
//         default=uuid.uuid4,
//         editable=False)
//     created_at = models.DateTimeField(
//         'date created', auto_now_add=True, db_index=True)
//     updated_at = models.DateTimeField(auto_now=True, db_index=True)
//     name = models.TextField('name of the experiment', db_index=True)
//     description = models.TextField(
//         'description of the experiment', db_index=True)
//     agent_rl_playing_url = models.TextField(
//         'url of the rl agent in action after fine tuning', db_index=True, blank=True, null=True)
//     agent_rl_training_chart_url = models.TextField(
//         'url of the rl agent training chart', db_index=True, blank=True, null=True)
//     behavior_cloning_agent_playing_url = models.TextField(
//         'url of the agent in action after immitation', db_index=True, blank=True, null=True)
//     behavior_cloning_train_chart_url = models.TextField(
//         'url of the behavior cloning training chart', db_index=True, blank=True, null=True)
//     collection_time_seconds = models.IntegerField(
//         'time in seconds to collect training data', db_index=True, blank=True, null=True)
//     agent_immitation_playing_url = models.TextField(
//         'url of the agent in action after immitation', db_index=True, blank=True, null=True)
//     agent_cql_playing_url = models.TextField(
//         'url of the agent in action after cql', db_index=True, blank=True, null=True)
//     training_data_url = models.TextField(
//         'url of the training data', db_index=True, blank=True, null=True)
//     rl_human_fusion_score = models.FloatField(
//         'rl score after averaging over ten games', db_index=True, blank=True, default=0)
//     immitation_score = models.FloatField(
//         'immitation score after averaging over ten games', db_index=True, blank=True, default=0)
//     cql_score = models.FloatField(
//         'cql score after averaging over ten games', db_index=True, blank=True, default=0)
//     is_training_data_uploaded = models.BooleanField(
//         'is training data uploaded', default=False)
//     is_done_training = models.BooleanField(
//         'is done training', default=False)
//     data_balance_enforced = models.BooleanField(
//         'is data balance enforced', default=False)
//     observation_count = models.IntegerField(
//         'number of observations', default=0)
//     finetune_model_url = models.TextField(
//         'url of the finetuned model', db_index=True, blank=True, null=True)
//     cql_model_url = models.TextField(
//         'url of the cql model', db_index=True, blank=True, null=True)
//     behavior_cloning_model_url = models.TextField(
//         'url of the behavior cloning model', db_index=True, blank=True, null=True)
//     training_data_uploaded_at = models.DateTimeField(
//         'date training data uploaded', db_index=True, blank=True, null=True)
export type IExperiment = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  agent_rl_playing_url: string;
  agent_rl_training_chart_url: string;
  behavior_cloning_agent_playing_url: string;
  behavior_cloning_train_chart_url: string;
  collection_time_seconds: number;
  agent_immitation_playing_url: string;
  agent_cql_playing_url: string;
  training_data_url: string;
  rl_human_fusion_score: number;
  immitation_score: number;
  cql_score: number;
  is_training_data_uploaded: boolean;
  is_done_training: boolean;
  data_balance_enforced: boolean;
  observation_count: number;
  finetune_model_url: string;
  cql_model_url: string;
  behavior_cloning_model_url: string;
  training_data_uploaded_at: string;
};
