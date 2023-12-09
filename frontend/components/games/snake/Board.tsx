"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseSnake,
  INCREMENT_SCORE,
  makeMove,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_UP,
  resetGame,
  RESET_SCORE,
  setLastAction,
  scoreUpdates,
  stopGame,
  setLastReward,
  setFood,
} from "@/store/actions";
import { IGlobalState } from "@/store/reducers";
import {
  clearBoard,
  drawObject,
  generateRandomPosition,
  hasSnakeCollided,
  IObjectBody,
  isDown,
  isRight,
  isUp,
  isLeft,
  getAction,
} from "@/utils";

export interface ICanvasBoard {
  height: number;
  width: number;
}
/**
 * CanvasBoard component represents the game board for the Snake game.
 * It renders a canvas element and handles the movement of the snake, object consumption, and game logic.
 *
 * @component
 * @param {ICanvasBoard} props - The component props.
 * @param {number} props.height - The height of the game board.
 * @param {number} props.width - The width of the game board.
 * @returns {JSX.Element} The CanvasBoard component.
 */
const CanvasBoard = ({ height, width }: ICanvasBoard) => {
  const dispatch = useDispatch();
  const snake1 = useSelector((state: IGlobalState) => state.snake);
  const food = useSelector((state: IGlobalState) => state.food);
  const disallowedDirection = useSelector(
    (state: IGlobalState) => state.disallowedDirection
  );

  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [isConsumed, setIsConsumed] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const moveSnake = useCallback(
    (dx = 0, dy = 0, ds: string) => {
      if (dx > 0 && dy === 0 && ds !== "RIGHT") {
        dispatch(makeMove(dx, dy, MOVE_RIGHT));
      }

      if (dx < 0 && dy === 0 && ds !== "LEFT") {
        dispatch(makeMove(dx, dy, MOVE_LEFT));
      }

      if (dx === 0 && dy < 0 && ds !== "UP") {
        dispatch(makeMove(dx, dy, MOVE_UP));
      }

      if (dx === 0 && dy > 0 && ds !== "DOWN") {
        dispatch(makeMove(dx, dy, MOVE_DOWN));
      }
    },
    [dispatch]
  );

  function handleMovement(event: KeyboardEvent) {
    const key = event.key;
    let isValidKey = false;
    if (isUp(key)) {
      event.preventDefault();
      moveSnake(0, -20, disallowedDirection);
      isValidKey = true;
    } else if (isDown(key)) {
      event.preventDefault();
      moveSnake(0, 20, disallowedDirection);
      isValidKey = true;
    } else if (isRight(key)) {
      event.preventDefault();
      moveSnake(20, 0, disallowedDirection);
      isValidKey = true;
    } else if (isLeft(key)) {
      event.preventDefault();
      moveSnake(-20, 0, disallowedDirection);
      isValidKey = true;
    }
    if (isValidKey) {
      // get action
      const action = getAction(key, disallowedDirection);
      dispatch(setLastAction(action));
    }
  }

  const handleKeyEvents = useCallback(
    (event: KeyboardEvent) => {
      if (disallowedDirection) {
        handleMovement(event);
      } else {
        if (
          disallowedDirection !== "LEFT" &&
          disallowedDirection !== "UP" &&
          disallowedDirection !== "DOWN" &&
          // check if the key pressed is a valid key
          (event.key === "ArrowRight" || event.key === "d")
        )
          console.log("here!");
        moveSnake(20, 0, disallowedDirection); //Move RIGHT at start
      }
    },
    [disallowedDirection, moveSnake]
  );

  const resetBoard = useCallback(() => {
    window.removeEventListener("keydown", handleKeyEvents);
    dispatch(resetGame());
    dispatch(scoreUpdates(RESET_SCORE));
    clearBoard(context);
    drawObject(context, snake1, "#91C483");
    let newFood = generateRandomPosition(width - 40, height - 40);
    drawObject(context, [newFood], "red"); //Draws object randomly
    dispatch(setFood(newFood));
    window.addEventListener("keydown", handleKeyEvents);
  }, [context, dispatch, handleKeyEvents, height, snake1, width]);

  useEffect(() => {
    //Generate new object
    if (isConsumed) {
      setIsConsumed(false);
      setLastReward(0);

      //Increase snake size when object is consumed successfully
      dispatch(increaseSnake());
      dispatch(setFood(generateRandomPosition(width - 40, height - 40)));

      //Increment the score
      dispatch(scoreUpdates(INCREMENT_SCORE));
    }
  }, [isConsumed, food, height, width, dispatch]);

  useEffect(() => {
    //Draw on canvas each time
    setContext(canvasRef.current && canvasRef.current.getContext("2d"));
    clearBoard(context);
    drawObject(context, snake1, "#91C483");

    drawObject(context, [food], "red");

    //When the object is consumed
    if (snake1[0].x === food?.x && snake1[0].y === food?.y) {
      setIsConsumed(true);
      dispatch(setLastReward(1));
    }

    if (
      hasSnakeCollided(snake1, snake1[0]) ||
      snake1[0].x >= width ||
      snake1[0].x <= 0 ||
      snake1[0].y <= 0 ||
      snake1[0].y >= height
    ) {
      dispatch(setLastReward(-1));
      setGameEnded(true);
      dispatch(stopGame());
      // play game over sound
      window.removeEventListener("keydown", handleKeyEvents);
      // wait for two seconds before resetting the board
      setTimeout(() => {
        resetBoard();
      }, 2000);
    } else setGameEnded(false);
  }, [context, food, snake1, height, width, dispatch, handleKeyEvents]);

  useEffect(() => {
    console.log("here!");
  }, [snake1]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyEvents);

    return () => {
      window.removeEventListener("keydown", handleKeyEvents);
    };
  }, [disallowedDirection, handleKeyEvents]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          border: `3px solid ${gameEnded ? "red" : "white"}`,
        }}
        width={width}
        height={height}
        className="mx-auto"
      />
    </>
  );
};

export default CanvasBoard;
