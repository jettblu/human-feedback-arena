import matplotlib.pyplot as plt
from IPython import display
import json

plt.ion()


def plot(scores, mean_scores):
    display.clear_output(wait=True)
    display.display(plt.gcf())
    plt.clf()
    plt.title('Training...')
    plt.xlabel('Number of Games')
    plt.ylabel('Score')
    plt.plot(scores)
    plt.plot(mean_scores)
    plt.ylim(ymin=0)
    plt.text(len(scores)-1, scores[-1], str(scores[-1]))
    plt.text(len(mean_scores)-1, mean_scores[-1], str(mean_scores[-1]))
    plt.show(block=False)
    plt.pause(.1)


def save_plot(scores, mean_scores, file_name, title='RL Training'):
    # save scores and mean scores to file as json
    score_object = {
        'scores': scores,
        'mean_scores': mean_scores
    }
    # get base file name
    file_name_base = file_name.split('.')[0]
    with open(file_name_base + '.json', 'w') as f:
        json.dump(score_object, f)
    # make black background
    plt.style.use('dark_background')
    plt.clf()
    plt.title(title)
    plt.xlabel('Number of Games')
    plt.ylabel('Score')
    plt.plot(scores)
    plt.plot(mean_scores)
    plt.ylim(ymin=0)
    plt.text(len(scores)-1, scores[-1], str(scores[-1]))
    plt.text(len(mean_scores)-1, mean_scores[-1], str(mean_scores[-1]))
    plt.savefig(file_name)


def save_plot_just_scores(scores, file_name, title='RL Training', xlabel='Number of Games', ylabel='Score'):
    # save scores and mean scores to file as json
    score_object = {
        'scores': scores
    }
    # get base file name
    file_name_base = file_name.split('.')[0]
    with open(file_name_base + '.json', 'w') as f:
        json.dump(score_object, f)
    # make black background
    plt.style.use('dark_background')
    plt.clf()
    plt.title(title)
    plt.xlabel('Number of Games')
    plt.ylabel('Score')
    plt.plot(scores)
    plt.ylim(ymin=0)
    plt.text(len(scores)-1, scores[-1], str(scores[-1]))
    plt.savefig(file_name)
