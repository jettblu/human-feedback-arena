"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from human_prefs import views


router = routers.DefaultRouter()
router.register(r'experiments', views.Experiment_View, 'experiment')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/experiment/<str:experiment_id>/',
         views.GetExperimentById.as_view()),
    path('api/experiment/<str:experiment_id>/uploadTrainingData/',
         views.UploadTrainingData.as_view()),
    path('api/test/',
         views.TestPing.as_view()),
    path('api/test2/',
         views.TestUpload.as_view()),
    # path('api/celeryTest/', views.CeleryTest.as_view()),
    path("api/test3/", views.Experiment_Test.as_view()),
    # path('api/experimentSummary/<str:experiment_name>/',
    #      views.GetExperimentSummary.as_view()),
]
