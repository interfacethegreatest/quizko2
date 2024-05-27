from django.urls import path

from . import views 

app_name = 'dashboard'

urlpatterns = [
    path('', views.index, name='index'),
    path('editForm', views.editForm, name='editForm'),  
    path('deleteForm', views.deleteForm, name="deleteForm"),
    path('getLoadData', views.getLoadData, name='getLoadData'),
]