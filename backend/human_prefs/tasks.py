
import os
from time import sleep
from celery import shared_task
from .models import Experiment
from snake.behaviorCloner import run_behavior_cloning
from snake.cqlTrainer import run_cql
from snake.finetune import run_finetuning
from snake.upload import uploadFile, training_data_bucket_name, game_play_bucket_name, model_bucket_name, charts_bucket_name


@shared_task
def run_entire_training_process(training_data, experiment_id):
    experiment = Experiment.objects.get(id=experiment_id)
    bc_avg_score, bc_gameplay_filepath, bc_plot_filepath, bc_model_filepath = run_behavior_cloning(
        training_data, experiment_id)
    bc_gameplay_url = uploadFile(
        bc_gameplay_filepath, bucket_name=game_play_bucket_name)
    bc_plot_url = uploadFile(bc_plot_filepath, bucket_name=charts_bucket_name)
    bc_model_url = uploadFile(bc_model_filepath, bucket_name=model_bucket_name)
    # inverse q learning
    cql_avg_score, cql_gameplay_path, cql_model_filepath = run_cql(
        training_data, experiment_id)
    cql_gameplay_url = uploadFile(
        cql_gameplay_path, bucket_name=game_play_bucket_name)
    cql_model_url = uploadFile(
        cql_model_filepath, bucket_name=model_bucket_name)
    # finetuning
    finetune_avg_score, finetune_gameplay_path, finetune_plot_filepath, finetune_model_filepath = run_finetuning(
        training_data, experiment_id)
    finetune_gameplay_url = uploadFile(
        finetune_gameplay_path, bucket_name=game_play_bucket_name)
    finetune_plot_url = uploadFile(
        finetune_plot_filepath, bucket_name=charts_bucket_name)
    finetune_model_url = uploadFile(
        finetune_model_filepath, bucket_name=model_bucket_name)

    # update experiment
    experiment.behavior_cloning_agent_playing_url = bc_gameplay_url
    experiment.behavior_cloning_train_chart_url = bc_plot_url
    experiment.agent_cql_playing_url = cql_gameplay_url
    experiment.agent_rl_playing_url = finetune_gameplay_url
    experiment.agent_rl_training_chart_url = finetune_plot_url
    experiment.rl_human_fusion_score = finetune_avg_score
    experiment.immitation_score = bc_avg_score
    experiment.cql_model_url = cql_model_url
    experiment.finetune_model_url = finetune_model_url
    experiment.behavior_cloning_model_url = bc_model_url
    experiment.cql_score = cql_avg_score
    experiment.is_done_training = True
    experiment.save()
    return experiment


@shared_task
def test_task():
    print("Hello world")
    sleep(2)
    # create new directory in system
    os.mkdir("temperature")
    return "Hello world"


def test_task2():
    print("Hello world")
    sleep(2)
    # create new directory in system
    os.mkdir("temperature2")
    return "Hello world"
