import json
from django.shortcuts import render
from .tasks import run_entire_training_process

from snake.upload import uploadFile, get_file_url
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
        training_data_uploaded_at = _pretty_time_elapsed(
            exp.training_data_uploaded_at, now)
        exp_to_return = exp
        exp_to_return.created_at = created_at
        exp_to_return.updated_at = updated_at
        exp_to_return.training_data_uploaded_at = training_data_uploaded_at
        return Response(exp_to_return)


# this class will receive training data as part of post request body
class UploadTrainingData(APIView):
    renderer_classes = [JSONRenderer]

    def post(self, request, experiment_id):
        exp = Experiment.objects.get(id=experiment_id)
        training_data = request.data['training_data']
        # save training data to file system as json
        training_data_filename = 'training_data_'+str(experiment_id)+'.json'
        save_object_to_file_system(training_data, training_data_filename)
        # upload to remote storage
        uploadFile(training_data_filename)
        # get url of uploaded file
        training_data_url = get_file_url(training_data_filename)
        # save url to db
        exp.training_data_url = training_data_url
        exp.is_training_data_uploaded = True
        training_data_uploaded_at = _pretty_time_elapsed(
            exp.training_data_uploaded_at, now)
        exp.training_data_uploaded_at = training_data_uploaded_at
        exp.save()
        # get time elapsed between created at and now
        now = datetime.now(timezone.utc)
        created_at = _pretty_time_elapsed(exp.created_at, now)
        updated_at = _pretty_time_elapsed(exp.updated_at, now)

        # now we want to run the entire training process
        task_id = run_entire_training_process.delay(
            training_data, experiment_id)

        return Response({'name': exp.name, 'description': exp.description, "created_at": created_at, "updated_at": updated_at, "training_data_url": training_data_url, "training_data_uploaded_at": training_data_uploaded_at})


def save_object_to_file_system(obj, file_name):
    with open(file_name, 'w') as outfile:
        json.dump(obj, outfile)

# class GetExperimentSummary(APIView):
#     renderer_classes = [JSONRenderer]
#     # here we don't need to serialize the data, so

#     def get(self, request, experiment_name):
#         exp = _build_experiment_resource(experiment_name)
#         return Response({'name': exp.name, 'num_responses': exp.num_responses, 'started_at': exp.started_at, 'pretty_time_elapsed': exp.pretty_time_elapsed})
