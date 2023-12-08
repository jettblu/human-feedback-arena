import uuid
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


class Experiment(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False)
    created_at = models.DateTimeField(
        'date created', auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    name = models.TextField('name of the experiment', db_index=True)
    description = models.TextField(
        'description of the experiment', db_index=True)
    agent_rl_playing_url = models.TextField(
        'url of the rl agent in action after fine tuning', db_index=True, blank=True, null=True)
    agent_immitation_playing_url = models.TextField(
        'url of the agent in action after immitation', db_index=True, blank=True, null=True)
    training_data_url = models.TextField(
        'url of the training data', db_index=True, blank=True, null=True)
    training_statistics_graph_url = models.TextField(
        'url of the training statistics graph which depeicts the avg score per round', db_index=True, blank=True, null=True)
    rl_human_fusion_score = models.FloatField(
        'rl score after averaging over ten games', db_index=True, blank=True, null=True)

    immitation_score = models.FloatField(
        'immitation score after averaging over ten games', db_index=True, blank=True, null=True)
    is_training_data_uploaded = models.BooleanField(
        'is training data uploaded', default=False)
    is_done_training = models.BooleanField(
        'is done training', default=False)

    def __str__(self):
        return self.name
