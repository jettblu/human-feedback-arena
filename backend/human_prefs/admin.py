from django.contrib import admin
from .models import Experiment

# Register your models here.


class ExperimentAdmin(admin.ModelAdmin):
    # display all fields in admin
    list_display = [field.name for field in Experiment._meta.get_fields()]


admin.site.register(Experiment, ExperimentAdmin)
