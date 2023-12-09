# this should be a pytorch model that receives a state and returns an action
# the state is a list of 8 elements, each element is a boolean
# the action is a list of 3 elements, each element is a boolean
# the action is encoded as follows:
# [1,0,0] -> straight
# [0,1,0] -> right
# [0,0,1] -> left

import numpy as np
import time
import pygame
from upload import uploadFile
from video import save_frames, save_animation
from game import SnakeGameAI, Direction, Point
import json
import random
import torch
import torch.nn as nn

from utils import action_encoder


class Policy_Model(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(Policy_Model, self).__init__()
        self.linear1 = nn.Linear(input_size, hidden_size)
        self.linear2 = nn.Linear(hidden_size, output_size)
        self.softmax = nn.Softmax(dim=1)
        self.relu = nn.ReLU()
        self.optimizer = torch.optim.Adam(self.parameters(), lr=0.001)

    def forward(self, x):
        x = self.relu(self.linear1(x))
        x = self.relu(self.linear2(x))
        x = self.softmax(x)
        return x

    def get_action(self, state):
        print("Getting action")
        state = torch.FloatTensor([state])
        action_probs = self.forward(state)
        print(action_probs)
        action = torch.multinomial(action_probs, 1)
        # with some probability choose a random action
        if random.random() < 0.05:
            print("Random action")
            action = torch.randint(0, 3, (1,))
        return action.item()

    def loss(self, output, labels):
        return torch.nn.functional.cross_entropy(output, labels)

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

    # train on a batch of data
    def train_step(self, input, labels):
        self.optimizer.zero_grad()
        output = self.forward(input)
        loss = self.loss(output, labels)
        loss.backward()
        self.optimizer.step()
        return loss.item()


# load training data from training_data.json
training_data = json.load(
    open("backend/training_data_ec41bcaf-9dc6-42ec-a74f-b3e86afedb13.json"))

# train agent on training data
model = Policy_Model(13, 256, 3)

Batch_Size = 256
Epochs = 50
print("Training on {} samples".format(len(training_data)))
for e in range(Epochs):
    print("Epoch: {}".format(e))
    epoch_loss = []
    # scramble training data
    random.shuffle(training_data)
    for i in range(len(training_data) // Batch_Size):
        batch = training_data[i * Batch_Size: (i + 1) * Batch_Size]
        states = []
        labels = []
        for data in batch:
            state = data["state"]
            action = data["action"]
            action = action_encoder(action)
            states.append(state)
            labels.append(action)
        loss = model.train_step(torch.FloatTensor(states),
                                torch.FloatTensor(labels))
        epoch_loss.append(loss)
    avg_epoch_loss = sum(epoch_loss) / len(epoch_loss)
    print("Epoch {}, loss: {}".format(e, avg_epoch_loss))

# save the trained model
torch.save(model.state_dict(), "policy_model.pth")
# now run the game with the trained model

# load the trained model
model = Policy_Model(11, 256, 3)
# model.load_state_dict(torch.load("backend/policy_model.pth"))

game = SnakeGameAI()
agent = Policy_Model(11, 256, 3)
game.reset()
score = 0
prev_score = 0
scores = []
frame_list = []
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
        video_name = f"rl_video_test_immitation.mp4"
        save_animation(frame_list, video_name, 10)
        break
uploadFile(video_name)
