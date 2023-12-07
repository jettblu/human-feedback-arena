import { Observation } from "@/types";
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
  SET_OBSERVATION_REQUIREMENT,
  UP,
} from "../actions";

export interface IGlobalState {
  snake: ISnakeCoord[] | [];
  disallowedDirection: string;
  score: number;
  personalBest: number;
  observations: Observation[];
  experimentName: string;
  obersvationsRequired: number;
  totalObservations: number;
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
  disallowedDirection: "",
  score: 0,
  personalBest: 0,
  experimentName: "",
  observations: [],
  obersvationsRequired: 0,
  totalObservations: 0,
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
      };
    }

    case SET_DIS_DIRECTION:
      return { ...state, disallowedDirection: action.payload };

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
        disallowedDirection: "",
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
      return {
        ...state,
        obersvations: [...state.observations, action.payload],
        totalObservations: state.totalObservations + 1,
      };
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
        disallowedDirection: "",
      };
    default:
      return state;
  }
};

export default gameReducer;
