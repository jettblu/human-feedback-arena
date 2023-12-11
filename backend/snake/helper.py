# from matplotlib import pyplot as plt
# import matplotlib
# from IPython import display
import json
# matplotlib.use('Agg')


def save_plot(scores, mean_scores, file_name, title='RL Training'):
    # save scores and mean scores to file as json

    score_object = {
        'values': scores,
        'mean_values': mean_scores,
        'xlabel': "Number of Games",
        'ylabel': "Score",
        'title': title
    }
    # get base file name
    file_name_base = file_name.split('.')[0]
    with open(file_name_base + '.json', 'w') as f:
        json.dump(score_object, f)
    # make black background
    # plt.style.use('dark_background')
    # plt.clf()
    # plt.title(title)
    # plt.xlabel('Number of Games')
    # plt.ylabel('Score')
    # plt.plot(scores)
    # plt.plot(mean_scores)
    # plt.ylim(ymin=0)
    # plt.text(len(scores)-1, scores[-1], str(scores[-1]))
    # plt.text(len(mean_scores)-1, mean_scores[-1], str(mean_scores[-1]))
    # plt.savefig(file_name)


def save_plot_just_scores(scores, file_path, title='RL Training', xlabel='Number of Games', ylabel='Score'):
    # save scores and mean scores to file as json
    score_object = {
        'values': scores,
        'xlabel': xlabel,
        'ylabel': ylabel,
        'title': title
    }
    # get base file name
    # file_name_base = file_name.split('.')[0]
    # print("writing plot data to file: ", file_name_base + '.json')
    print("writing plot data to file: ", file_path)
    with open(file_path, 'w') as f:
        json.dump(score_object, f)
    print("done writing plot data to file")
    # print("done writing to file")
    # make black background
    # plt.style.use('dark_background')
    # plt.clf()
    # plt.title(title)
    # plt.xlabel(xlabel)
    # plt.ylabel(ylabel)
    # plt.plot(scores)
    # plt.ylim(ymin=0)
    # plt.text(len(scores)-1, scores[-1], str(scores[-1]))
    # plt.savefig(file_name)
