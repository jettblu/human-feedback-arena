import json
import random
import numpy as np
from torch.nn.utils import clip_grad_norm_
import torch.nn.functional as F
import torch.optim as optim
import torch
import torch.nn as nn
from .video import save_animation

from .game import SnakeGameAI
from .utils import format_data, get_state


class DDQN(nn.Module):
    def __init__(self, state_size, action_size, layer_size):
        super(DDQN, self).__init__()
        self.input_shape = state_size
        self.action_size = action_size
        self.head_1 = nn.Linear(self.input_shape[0], layer_size)
        self.ff_1 = nn.Linear(layer_size, layer_size)
        self.ff_2 = nn.Linear(layer_size, action_size)

    def forward(self, input):
        """

        """
        x = torch.relu(self.head_1(input))
        x = torch.relu(self.ff_1(x))
        out = self.ff_2(x)

        return out


class CQLAgent():
    def __init__(self, state_size, action_size, hidden_size=256, device="cpu"):
        self.state_size = state_size
        self.action_size = action_size
        self.device = device
        self.tau = 1e-3
        self.gamma = 0.99

        self.network = DDQN(state_size=self.state_size,
                            action_size=self.action_size,
                            layer_size=hidden_size
                            ).to(self.device)

        self.target_net = DDQN(state_size=self.state_size,
                               action_size=self.action_size,
                               layer_size=hidden_size
                               ).to(self.device)

        self.optimizer = optim.Adam(params=self.network.parameters(), lr=1e-3)

    def get_action(self, state, epsilon):
        actions = [0, 0, 0]
        if random.random() > epsilon:
            state = torch.from_numpy(
                state).float().unsqueeze(0).to(self.device)
            self.network.eval()
            with torch.no_grad():
                action_values = self.network(state)
            self.network.train()
            action_index = np.argmax(action_values.cpu().data.numpy())
            actions[action_index] = 1
        else:
            action_index = np.random.choice([0, 1, 2])
            actions[action_index] = 1
        return actions

    def cql_loss(self, q_values, current_action):
        """Computes the CQL loss for a batch of Q-values and actions."""
        logsumexp = torch.logsumexp(q_values, dim=1, keepdim=True)
        q_a = q_values.gather(1, current_action)

        return (logsumexp - q_a).mean()

    def batch_learn(self, experiences, batch_size, num_epochs):
        """Update value parameters using given batch of experience tuples.

        Params
        ======
            experiences list of tuples of (s, a, r, s', done)
            batch_size (int): size of each training batch
            num_epochs (int): number of epochs
        """

        # now we want to train the agent on the data
        for e in range(num_epochs):
            print("Epoch: ", e)
            random.shuffle(experiences)
            if (len(experiences) < batch_size):
                batch_size = len(experiences)
            for i in range(0, len(experiences), batch_size):
                batch = experiences[i:i+batch_size]
                self.learn(batch)

    def learn(self, experiences):
        # experiences should be a list of tuples of (s, a, r, s', done)

        # get the states, actions, rewards, next_states, and dones
        states, actions, rewards, next_states, dones = zip(*experiences)
        # each is currently a tuples of tensors
        # we want to convert them to tensors
        states = torch.from_numpy(np.vstack(states)).float().to(self.device)
        actions = torch.from_numpy(np.vstack(actions)).long().to(self.device)
        rewards = torch.from_numpy(np.vstack(rewards)).float().to(self.device)
        next_states = torch.from_numpy(
            np.vstack(next_states)).float().to(self.device)
        dones = torch.from_numpy(np.vstack(dones).astype(
            np.uint8)).float().to(self.device)

        with torch.no_grad():
            Q_targets_next = self.target_net(next_states).detach().max(1)[
                0].unsqueeze(1)
            Q_targets = rewards + (self.gamma * Q_targets_next * (1 - dones))

        Q_a_s = self.network(states)
        Q_expected = Q_a_s.gather(1, actions)

        cql1_loss = self.cql_loss(Q_a_s, actions)

        bellman_error = F.mse_loss(Q_expected, Q_targets)

        q1_loss = cql1_loss + 0.5 * bellman_error

        self.optimizer.zero_grad()
        q1_loss.backward()
        clip_grad_norm_(self.network.parameters(), 1.)
        self.optimizer.step()

        # ------------------- update target network ------------------- #
        self.soft_update(self.network, self.target_net)
        return q1_loss.detach().item(), cql1_loss.detach().item(), bellman_error.detach().item()

    def soft_update(self, local_model, target_model):
        for target_param, local_param in zip(target_model.parameters(), local_model.parameters()):
            target_param.data.copy_(
                self.tau*local_param.data + (1.0-self.tau)*target_param.data)


def train():
    # load training data
    training_data = json.load(
        open("backend/training_data_ec41bcaf-9dc6-42ec-a74f-b3e86afedb13.json"))
    formatted_data = format_data(training_data)

    # train agent on training data

    # set up the agent
    num_inputs = 13
    num_actions = 3
    hidden_size = 256
    device = "cpu"
    agent = CQLAgent(state_size=(num_inputs,), action_size=num_actions,
                     hidden_size=hidden_size, device=device)
    agent.batch_learn(formatted_data, batch_size=256, num_epochs=50)


def run_cql(training_data, experiment_id, num_epochs=20):
    formatted_data = format_data(training_data, one_hot=False)
    # train agent on training data

    # set up the agent
    num_inputs = 13
    num_actions = 3
    hidden_size = 256
    device = "cpu"
    agent = CQLAgent(state_size=(num_inputs,), action_size=num_actions,
                     hidden_size=hidden_size, device=device)
    agent.batch_learn(formatted_data, batch_size=256, num_epochs=num_epochs)

    # play game with trained agent

    game = SnakeGameAI()

    # now let's play the game

    game.reset()
    num_games = 10
    i = 0
    scores = []
    frames = []
    while i < num_games:

        # get old state
        state_old = get_state(game)

        state_old = np.array(state_old, dtype=np.float32)

        # get move
        final_move = agent.get_action(state_old, epsilon=.2)

        # perform move and get new state
        reward, done, score = game.play_step(final_move)

        if i == num_games - 1:
            frames.append(game.display.copy())

        if done:
            game.reset()
            scores.append(score)
            i += 1

    avg_score = sum(scores) / len(scores)
    animation_name = "temp/gameplay_cql_"+str(experiment_id)+".gif"
    save_animation(frames, animation_name)
    # save model
    model_path = "temp/cql_model_"+str(experiment_id)+".pth"
    torch.save(agent.network.state_dict(), model_path)
    return avg_score, animation_name, model_path


# if __name__ == "__main__":
#     # load training data
#     training_data = json.load(
#         open("backend/training_data_44e0ee25-9321-4052-a529-2513a72de142.json"))
#     run_cql(training_data, "test")
