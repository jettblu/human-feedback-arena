import { ISnakeCoord } from "@/store/actions";
import { Action, Direction, Observation } from "@/types";
import { dir } from "console";

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
): boolean[] | null {
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
    danger_straight,
    danger_right,
    danger_left,
    dir_l,
    dir_r,
    dir_u,
    dir_d,
    food.x < snakeHead.x,
    food.x > snakeHead.x,
    food.y < snakeHead.y,
    food.y > snakeHead.y,
  ];
  return snakeObservation;
}
