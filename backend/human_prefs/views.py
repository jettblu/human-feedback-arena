import json
from django.shortcuts import render
from .tasks import run_entire_training_process, test_task, test_task2

from snake.upload import uploadFile, get_file_url, training_data_bucket_name
from .models import Experiment
from .serializers import Experiment_Serializer
from rest_framework import viewsets

from rest_framework.renderers import JSONRenderer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from datetime import datetime
from datetime import timezone


# Create your views here.


class Experiment_View(viewsets.ModelViewSet):
    parser_classes = [JSONParser]
    serializer_class = Experiment_Serializer
    queryset = Experiment.objects.all()


def _pretty_time_elapsed(start, end):
    total_seconds = (end - start).total_seconds()
    hours, rem = divmod(total_seconds, 3600)
    minutes, seconds = divmod(rem, 60)
    return ("{:0>2}:{:0>2}:{:0>2}".format(int(hours), int(minutes), int(seconds)))

# create a new view that returns a model by id


class GetExperimentById(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request, experiment_id):
        exp = Experiment.objects.get(id=experiment_id)
        # get time elapsed between created at and now
        now = datetime.now(timezone.utc)
        created_at = _pretty_time_elapsed(exp.created_at, now)
        updated_at = _pretty_time_elapsed(exp.updated_at, now)
        training_data_uploaded_at = ""
        if (exp.training_data_uploaded_at):
            training_data_uploaded_at = _pretty_time_elapsed(
                exp.training_data_uploaded_at, now)
        exp_to_return = exp
        # serialize the experiment
        exp_to_return = Experiment_Serializer(exp_to_return).data
        exp_to_return["created_at"] = created_at
        exp_to_return["updated_at"] = updated_at
        exp_to_return["training_data_uploaded_at"] = training_data_uploaded_at
        return Response(exp_to_return)


class TestPing(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        return Response({"ping": "pong"})


class TestUpload(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        training_data_path = "training data dev/training_data_ec41bcaf-9dc6-42ec-a74f-b3e86afedb13.json"
        uploadFile(training_data_path,
                   bucket_name=training_data_bucket_name, remove_local_file=False)
        return Response({"done": "true"})


# class CeleryTest(APIView):
#     renderer_classes = [JSONRenderer]

#     def get(self, request):
#         task_id = test_task.delay()
#         return Response({"task_id": "test"})


class Experiment_Test(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        # run_entire_training_process(training_data, experiment_id
        experiment_id = "ec41bcaf-9dc6-42ec-a74f-b3e86afedb13"
        training_data = json.load(
            open("training data dev/training_data_ec41bcaf-9dc6-42ec-a74f-b3e86afedb13.json"))
        task_id = run_entire_training_process(
            training_data, experiment_id)
        return Response({"task_complete": True})


# this class will receive training data as part of post request body
class UploadTrainingData(APIView):
    renderer_classes = [JSONRenderer]

    def post(self, request, experiment_id):
        exp = Experiment.objects.get(id=experiment_id)
        training_data = request.data['training_data']
        print("training_data", training_data)
        collection_time_seconds = request.data['collection_time_seconds']
        print("collection_time_seconds", collection_time_seconds)
        # save training data to file system as json
        training_data_filename = '/tmp/training_data_' + \
            str(experiment_id)+'.json'
        save_object_to_file_system(training_data, training_data_filename)
        # upload to remote storage
        training_data_url = uploadFile(training_data_filename,
                                       bucket_name=training_data_bucket_name)
        # save url to db
        exp.training_data_url = training_data_url
        exp.is_training_data_uploaded = True
        # save total time to collect observations
        exp.collection_time_seconds = collection_time_seconds
        exp.observation_count = len(training_data)
        exp.training_data_uploaded_at
        now = datetime.now(timezone.utc)
        exp.training_data_uploaded_at = now
        exp.save()

        # now we want to run the entire training process

        exp = run_entire_training_process(
            training_data, experiment_id
        )
        now = datetime.now(timezone.utc)
        created_at = _pretty_time_elapsed(exp.created_at, now)
        updated_at = _pretty_time_elapsed(exp.updated_at, now)
        training_data_uploaded_at = ""
        if (exp.training_data_uploaded_at):
            training_data_uploaded_at = _pretty_time_elapsed(
                exp.training_data_uploaded_at, now)

        # serialize the experiment
        exp_to_return = Experiment_Serializer(exp).data
        exp_to_return["created_at"] = created_at
        exp_to_return["updated_at"] = updated_at
        exp_to_return["training_data_uploaded_at"] = training_data_uploaded_at

        return Response(exp_to_return)


def save_object_to_file_system(obj, file_name):
    with open(file_name, 'w') as outfile:
        json.dump(obj, outfile)

# class GetExperimentSummary(APIView):
#     renderer_classes = [JSONRenderer]
#     # here we don't need to serialize the data, so

#     def get(self, request, experiment_name):
#         exp = _build_experiment_resource(experiment_name)
#         return Response({'name': exp.name, 'num_responses': exp.num_responses, 'started_at': exp.started_at, 'pretty_time_elapsed': exp.pretty_time_elapsed})
