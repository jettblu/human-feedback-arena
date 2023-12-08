from django.shortcuts import render
from .models import Experiment
from .serializers import Experiment_Serializer
from rest_framework import viewsets

# Create your views here.


class Experiment_View(viewsets.ModelViewSet):
    serializer_class = Experiment_Serializer
    queryset = Experiment.objects.all()


def _pretty_time_elapsed(start, end):
    total_seconds = (end - start).total_seconds()
    hours, rem = divmod(total_seconds, 3600)
    minutes, seconds = divmod(rem, 60)
    return ("{:0>2}:{:0>2}:{:0>2}".format(int(hours), int(minutes), int(seconds)))


# class GetExperimentSummary(APIView):
#     renderer_classes = [JSONRenderer]
#     # here we don't need to serialize the data, so

#     def get(self, request, experiment_name):
#         exp = _build_experiment_resource(experiment_name)
#         return Response({'name': exp.name, 'num_responses': exp.num_responses, 'started_at': exp.started_at, 'pretty_time_elapsed': exp.pretty_time_elapsed})
