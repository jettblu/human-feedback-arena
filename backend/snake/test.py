import json
import torch
import random
import numpy as np
from collections import deque
from utils import action_encoder
from game import SnakeGameAI, Direction, Point
from model import Linear_QNet, QTrainer
from helper import plot, save_plot
from upload import uploadFile
from video import save_frames

MAX_MEMORY = 100_000
BATCH_SIZE = 1000
LR = 0.001


class Agent:

    def __init__(self):
        self.n_games = 0
        self.epsilon = 0  # randomness
        self.gamma = 0.9  # discount rate
        self.memory = deque(maxlen=MAX_MEMORY)  # popleft()
        self.model = Linear_QNet(11, 256, 3)
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)

    def get_state(self, game):
        head = game.snake[0]
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
            game.food.y > game.head.y  # food down
        ]

        return np.array(state, dtype=int)

    def remember(self, state, action, reward, next_state, done):
        # popleft if MAX_MEMORY is reached
        self.memory.append((state, action, reward, next_state, done))

    def train_long_memory(self):
        if len(self.memory) > BATCH_SIZE:
            mini_sample = random.sample(
                self.memory, BATCH_SIZE)  # list of tuples
        else:
            mini_sample = self.memory

        states, actions, rewards, next_states, dones = zip(*mini_sample)
        self.trainer.train_step(states, actions, rewards, next_states, dones)
        # for state, action, reward, nexrt_state, done in mini_sample:
        #    self.trainer.train_step(state, action, reward, next_state, done)

    def train_short_memory(self, state, action, reward, next_state, done):
        self.trainer.train_step(state, action, reward, next_state, done)

    def get_action(self, state):
        # random moves: tradeoff exploration / exploitation
        self.epsilon = 80 - self.n_games
        final_move = [0, 0, 0]
        if random.randint(0, 200) < self.epsilon:
            move = random.randint(0, 2)
            final_move[move] = 1
        else:
            state0 = torch.tensor(state, dtype=torch.float)
            prediction = self.model(state0)
            move = torch.argmax(prediction).item()
            final_move[move] = 1

        return final_move


def train():
    agent = Agent()
    # load training data from training_data.json
    training_data = json.load(open("backend/training_data.json"))
    print("Training data loaded")
    # train agent on training data
    for data in training_data:
        print(data)
        state = data["state"]
        action = data["action"]
        action = action_encoder(action)
        reward = data["reward"]
        next_state = data["nextState"]
        agent.train_short_memory(state, action, reward, next_state, False)
    game = SnakeGameAI()
    # save model to file
    agent.model.save()
    # record video of game
    game.reset()
    frame_list = []
    video_name = ""
    random_number = random.randint(0, 100000)
    while True:
        # get old state
        state_old = agent.get_state(game)
        # get move
        final_move = agent.get_action(state_old)
        reward, done, score = game.play_step(final_move)
        # get surface array of game screen
        pg_frame = game.display.copy()
        frame_list.append(pg_frame)
        if done:
            print("Recording video")
            # convert list of frames to video
            video_name = f"rl_video_{random_number}"
            save_frames(frame_list, 10, "mp4", video_name)
            break
    uploadFile(video_name)


if __name__ == '__main__':
    train()
