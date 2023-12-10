
# load model
import json
from agent import Agent
from helper import save_plot, save_plot_just_scores
from game import SnakeGameAI
from utils import action_encoder
from video import save_animation


model_path = "model/pure_rl_200_iterations.pth"


def run_finetuning(training_data, experiment_id, num_epochs=20):
    formatted_data = []
    for data in training_data:
        state = data["state"]
        action = data["action"]
        action = action_encoder(action)
        nextState = data["nextState"]
        reward = data["reward"]
        done = False
        if reward == -1:
            done = True
        formatted_data.append((state, action, reward, nextState, done))

    # load into agent memory
    agent = Agent()
    agent.n_games = 200
    agent.model.load(model_path)
    for data in formatted_data:
        state, action, reward, nextState, done = data
        agent.remember(state, action, reward, nextState, done)

    game = SnakeGameAI()

    # now let's play the game

    game.reset()

    plot_scores = []
    for i in range(num_epochs):
        print("Epoch {}".format(i))
        agent.train_long_memory()
        # play game with trained agent to get score
        game.reset()
        score = 0
        while True:
            # get old state
            state_old = agent.get_state(game)
            # get move
            final_move = agent.get_action(state_old)
            # perform move and get new state
            reward, done, score = game.play_step(final_move)
            state_new = agent.get_state(game)
            if done:
                break
        print("Score: {}".format(score))
        plot_scores.append(score)

    # save figure
    figure_path = "temp/finetuning_" + \
        str(experiment_id)+str(num_epochs)+"epochs.png"
    figure_title = "Finetuning with "+str(num_epochs)+" epochs"
    save_plot_just_scores(plot_scores, figure_path, xlabel="Epochs",
                          ylabel="Score", title=figure_title)

    num_games = 10
    i = 0
    scores = []
    frames = []
    while i < num_games:
        # get old state
        state_old = agent.get_state(game)
        # get move
        final_move = agent.get_action(state_old)
        # perform move and get new state
        reward, done, score = game.play_step(final_move)
        if i == num_games - 1:
            frames.append(game.display.copy())
        if done:
            game.reset()
            scores.append(score)
            i += 1

    # save video
    game_play_vid_path = "temp/gameplay_finetuning_"+str(experiment_id)+".mp4"
    save_animation(frames, game_play_vid_path)
    final_avg_score = sum(scores) / len(scores)

    return final_avg_score, game_play_vid_path, figure_path


if __name__ == "__main__":
    # load training data
    training_data = json.load(
        open("backend/training_data_ec41bcaf-9dc6-42ec-a74f-b3e86afedb13.json", "r"))

    run_finetuning(training_data, "test", num_epochs=20)
