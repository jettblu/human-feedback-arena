import numpy as np
from .game import Direction, Point


def action_encoder(action, one_hot=True):
    if (one_hot == False):
        if action == "straight":
            return 0
        elif action == "right":
            return 1
        elif action == "left":
            return 2
    if action == "straight":
        return [1, 0, 0]
    elif action == "right":
        return [0, 1, 0]
    elif action == "left":
        return [0, 0, 1]


def format_data(training_data, one_hot=True):
    formatted_data = []

    for data in training_data:
        state = data["state"]
        action = data["action"]
        action = action_encoder(action, one_hot=one_hot)
        nextState = data["nextState"]
        reward = data["reward"]
        done = False
        if reward == -1:
            done = True
        formatted_data.append((state, action, reward, nextState, done))
    return formatted_data


def get_state(game):
    head = game.snake[0]
    food = game.food
    point_l = Point(head.x - 20, head.y)
    point_r = Point(head.x + 20, head.y)
    point_u = Point(head.x, head.y - 20)
    point_d = Point(head.x, head.y + 20)

    dir_l = game.direction == Direction.LEFT
    dir_r = game.direction == Direction.RIGHT
    dir_u = game.direction == Direction.UP
    dir_d = game.direction == Direction.DOWN

    state = [
        # Danger straight
        (dir_r and game.is_collision(point_r)) or
        (dir_l and game.is_collision(point_l)) or
        (dir_u and game.is_collision(point_u)) or
        (dir_d and game.is_collision(point_d)),

        # Danger right
        (dir_u and game.is_collision(point_r)) or
        (dir_d and game.is_collision(point_l)) or
        (dir_l and game.is_collision(point_u)) or
        (dir_r and game.is_collision(point_d)),

        # Danger left
        (dir_d and game.is_collision(point_r)) or
        (dir_u and game.is_collision(point_l)) or
        (dir_r and game.is_collision(point_u)) or
        (dir_l and game.is_collision(point_d)),

        # Move direction
        dir_l,
        dir_r,
        dir_u,
        dir_d,

        # Food location
        game.food.x < game.head.x,  # food left
        game.food.x > game.head.x,  # food right
        game.food.y < game.head.y,  # food up
        game.food.y > game.head.y,  # food down
        # get normalized angle between head and food with formula: atan2(y2 - y1, x2 - x1)/2pi
        np.arctan2(food.y - head.y, food.x - head.x) / (2 * np.pi),
        # get normalized dstance between head and food using formula: sqrt((x2 - x1)^2 + (y2 - y1)^2)/width
        np.sqrt((food.x - head.x)**2 + (food.y - head.y)**2) / \
        np.sqrt(game.w**2 + game.h**2)
    ]
    return state
