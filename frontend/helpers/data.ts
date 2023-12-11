import { ISnakeCoord } from "@/store/actions";
import { Action, Direction, Observation } from "@/types";

// this returns an observation that will be used on the backend for training
// observation based on the following python code:
// state = [
//     # Danger straight
//     (dir_r and game.is_collision(point_r)) or
//     (dir_l and game.is_collision(point_l)) or
//     (dir_u and game.is_collision(point_u)) or
//     (dir_d and game.is_collision(point_d)),

//     # Danger right
//     (dir_u and game.is_collision(point_r)) or
//     (dir_d and game.is_collision(point_l)) or
//     (dir_l and game.is_collision(point_u)) or
//     (dir_r and game.is_collision(point_d)),

//     # Danger left
//     (dir_d and game.is_collision(point_r)) or
//     (dir_u and game.is_collision(point_l)) or
//     (dir_r and game.is_collision(point_u)) or
//     (dir_l and game.is_collision(point_d)),

//     # Move direction
//     dir_l,
//     dir_r,
//     dir_u,
//     dir_d,

//     # Food location
//     game.food.x < game.head.x,  # food left
//     game.food.x > game.head.x,  # food right
//     game.food.y < game.head.y,  # food up
//     game.food.y > game.head.y  # food down
// ]
function hasSnakeCollided(snake: ISnakeCoord[], point: ISnakeCoord) {
  let flag = false;
  snake.forEach((pos: ISnakeCoord, index: number) => {
    if (pos.x === point.x && pos.y === point.y && index !== 0) {
      flag = true;
    }
  });

  return flag;
}

interface IParamsGetObservationSnake {
  snake: ISnakeCoord[];
  direction: Direction;
  lastAction: Action;
  food: ISnakeCoord;

  width: number;
  height: number;
}

export interface IParamsGetObservation extends IParamsGetObservationSnake {
  lastSnake: ISnakeCoord[];
  reward: number;
}

interface IParamsGetObservationInMiddleware {
  snake: ISnakeCoord[];
  newDirection: Direction;
  disallowedDirection: Direction;
  updateCoords: number[];
  food: ISnakeCoord;
  width: number;
  height: number;
}

export function getObservationInMiddleware(
  params: IParamsGetObservationInMiddleware
): Observation | null {
  let { snake, newDirection, disallowedDirection, food, width, height } =
    params;
  newDirection = newDirection.toLowerCase() as Direction;
  let action: Action = "none";
  switch (newDirection) {
    case "up":
      if (disallowedDirection === "right") {
        action = "left";
      }
      if (disallowedDirection === "left") {
        action = "right";
      }
      if (disallowedDirection === "down") {
        action = "straight";
      }
      break;
    case "down":
      if (disallowedDirection === "right") {
        action = "right";
      }
      if (disallowedDirection === "left") {
        action = "left";
      }
      if (disallowedDirection === "up") {
        action = "straight";
      }
      break;
    case "left":
      if (disallowedDirection === "up") {
        action = "left";
      }
      if (disallowedDirection === "down") {
        action = "right";
      }
      if (disallowedDirection === "right") {
        action = "straight";
      }
      break;
    case "right":
      if (disallowedDirection === "up") {
        action = "right";
      }
      if (disallowedDirection === "down") {
        action = "left";
      }
      if (disallowedDirection === "left") {
        action = "straight";
      }
      break;

    default:
      break;
  }

  const snakeObs = getObservationForSnake({
    snake,
    direction: newDirection,
    lastAction: action,
    food,
    width,
    height,
  });

  if (snakeObs == null) {
    return null;
  }

  const newSnake = [...snake];

  // add update to snake head
  const snakeHead = newSnake[0];
  newSnake[0] = {
    x: snakeHead.x + params.updateCoords[0],
    y: snakeHead.y + params.updateCoords[1],
  };

  const newSnakeObs = getObservationForSnake({
    snake: newSnake,
    direction: newDirection,
    lastAction: action,
    food,
    width,
    height,
  });

  if (newSnakeObs == null) {
    return null;
  }
  let reward = 0;
  // check if collided with self
  if (hasSnakeCollided(newSnake, newSnake[0])) {
    reward = -1;
  }

  // check if collided with wall
  if (
    newSnake[0].x < 0 ||
    newSnake[0].x >= width ||
    newSnake[0].y < 0 ||
    newSnake[0].y >= height
  ) {
    reward = -1;
  }

  // check if ate food
  if (newSnake[0].x === food.x && newSnake[0].y === food.y) {
    reward = 1;
  } else {
  }

  const observation: Observation = {
    state: snakeObs,
    action,
    reward: reward,
    nextState: newSnakeObs,
  };

  return observation;
}

export function getObservation(
  params: IParamsGetObservation
): Observation | null {
  const {
    lastSnake,
    reward,
    snake,
    direction,
    lastAction,
    food,
    width,
    height,
  } = params;
  const snakeObs = getObservationForSnake({
    snake,
    direction,
    lastAction,
    food,
    width,
    height,
  });
  const lastSnakeObs = getObservationForSnake({
    snake: lastSnake,
    direction,
    lastAction,
    food,
    width,
    height,
  });
  if (lastSnakeObs == null || snakeObs == null) {
    return null;
  }
  const observation: Observation = {
    state: lastSnakeObs,
    action: lastAction,
    reward: reward,
    nextState: snakeObs,
  };
  return observation;
}

function getObservationForSnake(
  params: IParamsGetObservationSnake
): number[] | null {
  const { snake, direction, lastAction, food, width, height } = params;
  const snakeHead = snake[0];
  try {
    let test = snakeHead.x;
  } catch {
    return null;
  }
  const point_l = { x: snakeHead.x - 20, y: snakeHead.y };
  const point_r = { x: snakeHead.x + 20, y: snakeHead.y };
  const point_u = { x: snakeHead.x, y: snakeHead.y - 20 };
  const point_d = { x: snakeHead.x, y: snakeHead.y + 20 };
  const dir_l = direction == "left";
  const dir_r = direction == "right";
  const dir_u = direction == "up";
  const dir_d = direction == "down";
  const danger_straight =
    (dir_r && hasSnakeCollided(snake, point_r)) ||
    (dir_l && hasSnakeCollided(snake, point_l)) ||
    (dir_u && hasSnakeCollided(snake, point_u)) ||
    (dir_d && hasSnakeCollided(snake, point_d));
  const danger_right =
    (dir_u && hasSnakeCollided(snake, point_r)) ||
    (dir_d && hasSnakeCollided(snake, point_l)) ||
    (dir_l && hasSnakeCollided(snake, point_u)) ||
    (dir_r && hasSnakeCollided(snake, point_d));
  const danger_left =
    (dir_d && hasSnakeCollided(snake, point_r)) ||
    (dir_u && hasSnakeCollided(snake, point_l)) ||
    (dir_r && hasSnakeCollided(snake, point_u)) ||
    (dir_l && hasSnakeCollided(snake, point_d));
  const snakeObservation = [
    danger_straight ? 1 : 0,
    danger_right ? 1 : 0,
    danger_left ? 1 : 0,
    dir_l ? 1 : 0,
    dir_r ? 1 : 0,
    dir_u ? 1 : 0,
    dir_d ? 1 : 0,
    food.x < snakeHead.x ? 1 : 0,
    food.x > snakeHead.x ? 1 : 0,
    food.y < snakeHead.y ? 1 : 0,
    food.y > snakeHead.y ? 1 : 0,
    // get normalized angle between snake head and food
    Math.atan2(food.y - snakeHead.y, food.x - snakeHead.x) / (2 * Math.PI),
    // get normaliized distance between snake head and food
    Math.sqrt(
      Math.pow(food.y - snakeHead.y, 2) + Math.pow(food.x - snakeHead.x, 2)
    ) / Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2)),
  ];
  return snakeObservation;
}

export function getExpectedCollectionTimeString(
  numObservations: number,
  dataBalanceEnforced: boolean
): string {
  if (isNaN(numObservations)) {
    return "0 minutes";
  }
  const numObservationsPerSecond = 200 / 60;
  let numSeconds = numObservations / numObservationsPerSecond;
  if (dataBalanceEnforced) {
    numSeconds = numSeconds * 5;
  }
  return timeStringFromSeconds(numSeconds);
}

export function timeStringFromSeconds(seconds: number): string {
  try {
    if (seconds < 60) {
      return `${Math.floor(seconds)} seconds`;
    }
    const numMinutes = Math.floor(seconds / 60);
    return `${numMinutes} minutes`;
  } catch (e) {
    console.error(e);
    return "5 minutes";
  }
}
