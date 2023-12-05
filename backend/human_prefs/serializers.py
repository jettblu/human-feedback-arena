from .models import Comparison
from rest_framework import serializers


class Comparison_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Comparison
        fields = ('created_at', 'updated_at', 'media_url_1',
                  'media_url_2', 'shown_to_tasker_at', 'responded_at', 'response_kind', 'response', 'experiment_name', 'priority', 'note')
