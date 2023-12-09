import {
  CallEffect,
  delay,
  put,
  PutEffect,
  select,
  SelectEffect,
  takeLatest,
} from "redux-saga/effects";
import {
  addObservation,
  DOWN,
  ISnakeCoord,
  LEFT,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_UP,
  RESET,
  RIGHT,
  setDisDirection,
  setLastAction,
  STOP_GAME,
  UP,
} from "../actions";
import { getAction } from "@/utils";
import { IGlobalState } from "@/store/reducers";
import { Action, Direction, Observation } from "@/types";
import { getObservation, getObservationInMiddleware } from "@/helpers/data";

export function* moveSaga(params: {
  type: string;
  payload: ISnakeCoord;
}): Generator<
  | PutEffect<{ type: string; payload: ISnakeCoord }>
  | PutEffect<{ type: string; payload: string }>
  | PutEffect<{ type: string; payload: Observation }>
  | SelectEffect
  | CallEffect<true>
> {
  while (params.type !== RESET && params.type !== STOP_GAME) {
    let disallowedDirection: any = yield select(
      (state: IGlobalState) => state.disallowedDirection
    );
    let snake: any = yield select((state: IGlobalState) => state.snake);
    if (disallowedDirection) {
      disallowedDirection = disallowedDirection.toLowerCase();
    }
    let food: any = yield select((state: IGlobalState) => state.food);
    let action: Action = "none";
    yield put({
      type: params.type.split("_")[1],
      payload: params.payload,
    });
    switch (params.type.split("_")[1]) {
      case RIGHT:
        yield put(setDisDirection(LEFT));
        if (disallowedDirection === "down") {
          action = "right";
        }
        if (disallowedDirection === "up") {
          action = "left";
        }
        if (disallowedDirection === "left") {
          action = "straight";
        }
        break;

      case LEFT:
        // const action = getAction("left", disallowedDirection);
        yield put(setDisDirection(RIGHT));
        if (disallowedDirection === "down") {
          action = "left";
        }
        if (disallowedDirection === "up") {
          action = "right";
        }
        if (disallowedDirection === "right") {
          action = "straight";
        }
        break;

      case UP:
        yield put(setDisDirection(DOWN));
        if (disallowedDirection === "right") {
          action = "right";
        }
        if (disallowedDirection === "left") {
          action = "left";
        }
        if (disallowedDirection === "down") {
          action = "straight";
        }
        break;

      case DOWN:
        yield put(setDisDirection(UP));
        if (disallowedDirection === "right") {
          action = "left";
        }
        if (disallowedDirection === "left") {
          action = "right";
        }
        if (disallowedDirection === "up") {
          action = "straight";
        }
        break;
    }

    try {
      const observation: Observation | null = getObservationInMiddleware({
        snake,
        newDirection: params.type.split("_")[1] as Direction,
        disallowedDirection,
        updateCoords: params.payload as any,
        food: food,
        width: 1000,
        height: 600,
      });
      if (observation) {
        yield put(addObservation(observation));
      }
    } catch (e) {
      console.log(e);
    }

    yield put(setLastAction(action));
    // console.log("action", action);
    yield delay(100);
  }
}

function* watcherSagas() {
  yield takeLatest(
    [MOVE_RIGHT, MOVE_LEFT, MOVE_UP, MOVE_DOWN, RESET, STOP_GAME],
    moveSaga
  );
}

export default watcherSagas;
