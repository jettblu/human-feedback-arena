import json
import os
from google.cloud import storage

# uploads file form local computer to google bucket

bucket_name = "snake-ai"
training_data_bucket_name = "snake-ai-training-data"
game_play_bucket_name = "snake-ai-game-play"
model_bucket_name = "snake-ai-model"
charts_bucket_name = "snake-ai-charts"
credentials_path = "backend/snake/serviceAccountCredentialsForRLHF.json"


def uploadFile(filePath: str, bucket_name=bucket_name, remove_local_file=True):
    fileName: str = filePath.split("/")[-1]
    storage_client = storage.Client.from_service_account_json(
        json_credentials_path=credentials_path)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(fileName)
    blob.upload_from_filename(filePath)
    if (remove_local_file):
        # remove file from local file system
        os.remove(filePath)
    return fileName


def get_file_url(fileName, bucket_name=bucket_name):
    return "https://storage.googleapis.com/{}/{}".format(bucket_name, fileName)


def upload_training_data(training_data, experiment_id, bucket_name=training_data_bucket_name, remove_local_file=True):
    # save training data to file system as json
    training_data_filename = 'training_data_'+str(experiment_id)+'.json'
    training_data_filepath = "temp/"+training_data_filename
    json.dump(training_data, open(training_data_filepath, "w"))
    # upload to remote storage
    uploadFile(training_data_filename)
    # get url of uploaded file
    training_data_url = get_file_url(training_data_filename)
    if (remove_local_file):
        # delete file from local file system
        os.remove(training_data_filepath)
    return training_data_url
