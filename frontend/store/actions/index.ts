import { Observation } from "@/types";

export const MOVE_RIGHT = "MOVE_RIGHT";
export const MOVE_LEFT = "MOVE_LEFT";
export const MOVE_UP = "MOVE_UP";
export const MOVE_DOWN = "MOVE_DOWN";

export const RIGHT = "RIGHT";
export const LEFT = "LEFT";

export const UP = "UP";

export const DOWN = "DOWN";
export const STRAIGHT = "STRAIGHT";

export const SET_DIS_DIRECTION = "SET_DIS_DIRECTION";

export const SET_EXPERIMENT_ID = "SET_EXPERIMENT_ID";
export const RESET = "RESET";
export const STOP_GAME = "STOP_GAME";
export const INCREASE_SNAKE = "INCREASE_SNAKE";
export const INCREMENT_SCORE = "INCREMENT_SCORE";
export const CLEAR_ALL_GAME_DATA = "RESET_ALL_GAME_DATA";
export const RESET_SCORE = "RESET_SCORE";
export const ADD_OBSERVATION = "ADD_OBSERVATION";
export const SET_OBSERVATION_REQUIREMENT = "SET_OBSERVATION_REQUIREMENT";
export const SET_LAST_ACTION = "SET_LAST_ACTION";
export const SET_FOOD = "SET_FOOD";
export const SET_LAST_REWARD = "SET_LAST_REWARD";
export const SET_EXPERIMENT_NAME = "SET_EXPERIMENT_NAME";
export const SET_EXPERIMENT_DESCRIPTION = "SET_EXPERIMENT_DESCRIPTION";
export interface ISnakeCoord {
  x: number;
  y: number;
}

export const makeMove = (dx: number, dy: number, move: string) => ({
  type: move,
  payload: [dx, dy],
});

export const setLastAction = (action: string) => ({
  type: SET_LAST_ACTION,
  payload: action,
});

export const setLastReward = (reward: number) => ({
  type: SET_LAST_REWARD,
  payload: reward,
});

export const setFood = (food: ISnakeCoord) => ({
  type: SET_FOOD,
  payload: food,
});

export const setDisDirection = (direction: string) => ({
  type: SET_DIS_DIRECTION,
  payload: direction,
});

export const resetGame = () => ({
  type: RESET,
});

export const stopGame = () => ({
  type: STOP_GAME,
});

export const increaseSnake = () => ({
  type: INCREASE_SNAKE,
});

export const scoreUpdates = (type: string) => ({
  type,
});

export const clearAllGameData = () => ({
  type: CLEAR_ALL_GAME_DATA,
});

export const addObservation = (observation: Observation) => ({
  type: ADD_OBSERVATION,
  payload: observation,
});

export const setObservationRequirement = (observationsCount: number) => ({
  type: SET_OBSERVATION_REQUIREMENT,
  payload: observationsCount,
});

export const setExperimentName = (name: string) => ({
  type: SET_EXPERIMENT_NAME,
  payload: name,
});

export const setExperimentDescription = (description: string) => ({
  type: SET_EXPERIMENT_DESCRIPTION,
  payload: description,
});

export const setExperimentId = (id: string) => ({
  type: SET_EXPERIMENT_ID,
  payload: id,
});
