from django.contrib import admin
from .models import Experiment


# Register your models here.


class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'updated_at', 'name',
                    'description', 'agent_rl_playing_url', 'agent_immitation_playing_url', 'training_data_url', 'training_statistics_graph_url', 'rl_human_fusion_score', 'immitation_score', 'is_training_data_uploaded', 'is_done_training')


admin.site.register(Experiment, ExperimentAdmin)
