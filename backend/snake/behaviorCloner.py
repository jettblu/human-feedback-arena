# create new neural network model with softmax output layer

import json
import random
import numpy as np
import torch.nn as nn
import torch
from video import save_animation
from helper import save_plot_just_scores
from game import Direction, Point, SnakeGameAI

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

    def loss(self, output, labels):
        return nn.functional.cross_entropy(output, labels)

    def act(self, state, epsilon=0.0):
        action = [0, 0, 0]
        if random.random() < epsilon:
            action_index = random.choice([0, 1, 2])
            action[action_index] = 1
            return action

        with torch.no_grad():
            state = torch.FloatTensor([state])

            action_probs = self.forward(state)
            print(action_probs)
            # choose the action with the highest probability and set
            # that action to 1 and the others to 0
            action[torch.argmax(action_probs).item()] = 1
        return action

    def train_step(self, input, labels):
        self.optimizer.zero_grad()
        output = self.forward(input)
        loss = self.loss(output, labels)
        loss.backward()
        self.optimizer.step()
        return loss.item()

    def save(self):
        torch.save(self.state_dict(), 'backend/policy_model.pth')

    def get_state(self, game):
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


def run_behavior_cloning(data_source, experiment_id):
    # for data convert action to one-hot vector
    for data in data_source:
        action = data["action"]
        action = action_encoder(action)
        print(action)
        data["action"] = action

    # split into training and validation data
    random.shuffle(data_source)
    split = int(len(data_source) * 0.8)
    training_data = data_source[:split]
    validation_data = data_source[split:]

    print("Training on {} samples".format(len(training_data)))
    print("Validating on {} samples".format(len(validation_data)))

    # here train our model to predict the action
    model = Policy_Model(13, 256, 3)

    # train model
    Epochs = 50
    Batch_Size = 100

    print("Training on {} samples".format(len(training_data)))
    validation_scores = []
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
                states.append(state)
                labels.append(action)
            loss = model.train_step(torch.FloatTensor(states),
                                    torch.FloatTensor(labels))
            epoch_loss.append(loss)
        avg_epoch_loss = sum(epoch_loss) / len(epoch_loss)
        # now compute validation accuracy
        validation_correct_count = 0
        for data in validation_data:
            state = data["state"]
            action = data["action"]
            prediction = model.act(state)
            # get position of ones in action and prediction
            action_index = action.index(1)
            prediction_index = prediction.index(1)
            if action_index == prediction_index:
                validation_correct_count += 1
        validation_accuracy = validation_correct_count / len(validation_data)
        validation_scores.append(validation_accuracy)
        print("Epoch {}, loss: {}, validation accuracy: {}".format(
            e, avg_epoch_loss, validation_accuracy))

    # now make a plot of the validation scores
    plot_name = "temp/behavior_cloning_" + \
        str(experiment_id)+"validation_scores.png"
    save_plot_just_scores(validation_scores, plot_name, xlabel="Epochs",
                          ylabel="Validation Accuracy", title="Behavior Cloning Validation Accuracy")

    # now try playing the game with the trained model
    game = SnakeGameAI()
    game.reset()

    num_games = 10
    i = 0
    frames = []
    scores = []
    while i < num_games:
        # get old state
        state_old = model.get_state(game)
        # get move
        final_move = model.act(state_old, .25)
        # perform move and get new state
        reward, done, score = game.play_step(final_move)
        if i == num_games - 1:
            frames.append(game.display.copy())
        if done:
            scores.append(score)
            game.reset()
            i += 1

    avg_score = sum(scores) / len(scores)

    # save video
    game_play_vid_path = "temp/gameplay_behavior_cloning" + \
        str(experiment_id)+".gif"
    save_animation(frames, game_play_vid_path)

    return avg_score, game_play_vid_path, plot_name


if __name__ == "__main__":
    data_source = json.load(
        open("backend/training_data_44e0ee25-9321-4052-a529-2513a72de142.json"))
    run_behavior_cloning(data_source, "test")
