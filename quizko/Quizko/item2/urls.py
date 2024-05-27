from django.urls import path

from .views import(
    detail,
    quiz_data_view,
    save_quiz_view,
)

app_name = 'quiz'

urlpatterns = [
    path('<int:pk>/', detail, name='detail'),
    path('<int:pk>/save/', save_quiz_view, name='save-view'),
    path('<int:pk>/data/', quiz_data_view, name='quiz-data-view'),
]