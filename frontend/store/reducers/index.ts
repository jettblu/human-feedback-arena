import { Action, Observation } from "@/types";
import {
  ADD_OBSERVATION,
  CLEAR_ALL_GAME_DATA,
  DOWN,
  INCREASE_SNAKE,
  INCREMENT_SCORE,
  ISnakeCoord,
  LEFT,
  RESET,
  RESET_SCORE,
  RIGHT,
  SET_DIS_DIRECTION,
  SET_EXPERIMENT_DESCRIPTION,
  SET_EXPERIMENT_ID,
  SET_EXPERIMENT_NAME,
  SET_FOOD,
  SET_LAST_ACTION,
  SET_LAST_REWARD,
  SET_OBSERVATION_REQUIREMENT,
  UP,
} from "../actions";
import { generateRandomPosition } from "@/utils";
import { DESIRED_NUMBER_OF_OBSERVATIONS } from "@/helpers/constants";

export interface IGlobalState {
  lastSnake: ISnakeCoord[] | [];
  snake: ISnakeCoord[] | [];
  food: ISnakeCoord;
  disallowedDirection: string;
  score: number;
  personalBest: number;
  observations: Observation[];
  experimentName: string;
  experimentId: string | null;
  experimentDescription: string;
  obersvationsRequired: number;
  totalObservations: number;
  lastAction: Action;
  lastReward: number;
  rightObservationCount: number;
  leftObservationCount: number;
  straightObservationCount: number;
}

const firstSnakeBit = { x: 580, y: 300 };

const globalState: IGlobalState = {
  snake: [
    { x: firstSnakeBit.x, y: firstSnakeBit.y },
    { x: firstSnakeBit.x - 20, y: firstSnakeBit.y },
    { x: firstSnakeBit.x - 40, y: firstSnakeBit.y },
    { x: firstSnakeBit.x - 60, y: firstSnakeBit.y },
    { x: firstSnakeBit.x - 80, y: firstSnakeBit.y },
  ],
  lastSnake: [],
  lastAction: "none",
  disallowedDirection: "",
  score: 0,
  personalBest: 0,
  experimentName: "",
  experimentDescription: "",
  experimentId: null,
  observations: [],
  obersvationsRequired: DESIRED_NUMBER_OF_OBSERVATIONS,
  totalObservations: 0,
  rightObservationCount: 0,
  leftObservationCount: 0,
  straightObservationCount: 0,
  food: generateRandomPosition(1000 - 40, 600 - 40),
  lastReward: 0,
};
const gameReducer = (state = globalState, action: any) => {
  switch (action.type) {
    case RIGHT:
    case LEFT:
    case UP:
    case DOWN: {
      let newSnake = [...state.snake];
      newSnake = [
        {
          x: state.snake[0].x + action.payload[0],
          y: state.snake[0].y + action.payload[1],
        },
        ...newSnake,
      ];
      newSnake.pop();
      return {
        ...state,
        snake: newSnake,
        lastSnake: state.snake,
      };
    }

    case SET_DIS_DIRECTION:
      return { ...state, disallowedDirection: action.payload };

    case SET_EXPERIMENT_NAME:
      return { ...state, experimentName: action.payload };

    case SET_EXPERIMENT_DESCRIPTION:
      return { ...state, experimentDescription: action.payload };

    case SET_EXPERIMENT_ID:
      return { ...state, experimentId: action.payload };
    case RESET:
      return {
        ...state,
        snake: [
          { x: firstSnakeBit.x, y: firstSnakeBit.y },
          { x: firstSnakeBit.x - 20, y: firstSnakeBit.y },
          { x: firstSnakeBit.x - 40, y: firstSnakeBit.y },
          { x: firstSnakeBit.x - 60, y: firstSnakeBit.y },
          { x: firstSnakeBit.x - 80, y: firstSnakeBit.y },
        ],
        lastSnake: [],
        disallowedDirection: "",
      };

    case SET_LAST_REWARD:
      return {
        ...state,
        lastReward: action.payload,
      };

    case SET_LAST_ACTION:
      return {
        ...state,
        lastAction: action.payload,
      };

    case INCREASE_SNAKE:
      const snakeLen = state.snake.length;
      return {
        ...state,
        snake: [
          ...state.snake,
          {
            x: state.snake[snakeLen - 1].x - 20,
            y: state.snake[snakeLen - 1].y - 20,
          },
        ],
        lastSnake: state.snake,
      };

    case SET_FOOD:
      return {
        ...state,
        food: action.payload,
      };

    case RESET_SCORE:
      // update personal best if need be
      if (state.score > state.personalBest) {
        return {
          ...state,
          score: 0,
          personalBest: state.score,
        };
      }
      return {
        ...state,
        score: 0,
      };

    case INCREMENT_SCORE:
      return {
        ...state,
        score: state.score + 1,
      };
    case ADD_OBSERVATION:
      if (action.payload.action === "right") {
        return {
          ...state,
          observations: [...state.observations, action.payload],
          totalObservations: state.totalObservations + 1,
          rightObservationCount: state.rightObservationCount + 1,
        };
      }
      if (action.payload.action === "left") {
        return {
          ...state,
          observations: [...state.observations, action.payload],
          totalObservations: state.totalObservations + 1,
          leftObservationCount: state.leftObservationCount + 1,
        };
      }
      if (action.payload.action === "straight") {
        return {
          ...state,
          observations: [...state.observations, action.payload],
          totalObservations: state.totalObservations + 1,
          straightObservationCount: state.straightObservationCount + 1,
        };
      }
      if (action.payload.action === "none") {
        return {
          ...state,
          obersvations: [...state.observations, action.payload],
          totalObservations: state.totalObservations + 1,
        };
      }
    case SET_OBSERVATION_REQUIREMENT:
      return {
        ...state,
        obersvationsRequired: action.payload,
      };
    case CLEAR_ALL_GAME_DATA:
      return {
        ...state,
        score: 0,
        personalBest: 0,
        snake: [
          { x: firstSnakeBit.x, y: firstSnakeBit.y },
          { x: firstSnakeBit.x - 20, y: firstSnakeBit.y },
          { x: firstSnakeBit.x - 40, y: firstSnakeBit.y },
          { x: firstSnakeBit.x - 60, y: firstSnakeBit.y },
          { x: firstSnakeBit.x - 80, y: firstSnakeBit.y },
        ],
        lastSnake: [],
        observations: [],
        totalObservations: 0,
        disallowedDirection: "",
        experimentName: "",
        experimentDescription: "",
        rightObservationCount: 0,
        leftObservationCount: 0,
        straightObservationCount: 0,
        lastReward: 0,
        food: null,
      };
    default:
      return state;
  }
};

export default gameReducer;
