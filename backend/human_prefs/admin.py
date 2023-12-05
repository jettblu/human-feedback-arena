from django.contrib import admin
from .models import Comparison


class ComparisonAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'updated_at', 'media_url_1',
                    'media_url_2', 'shown_to_tasker_at', 'responded_at', 'response_kind', 'response', 'experiment_name', 'priority', 'note')

# Register your models here.


admin.site.register(Comparison, ComparisonAdmin)
