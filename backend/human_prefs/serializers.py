from rest_framework import serializers

from .models import Experiment


# experiment serializer which will include all fields

class Experiment_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Experiment
        fields = '__all__'
