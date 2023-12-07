export type Observation = {
  state: boolean[];
  action: Action;
  reward: number;
  nextState: boolean[];
};

export type Action = "left" | "right" | "straight" | "none";

export type Direction = "up" | "down" | "left" | "right";
