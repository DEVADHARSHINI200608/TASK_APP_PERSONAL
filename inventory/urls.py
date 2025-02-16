from django.urls import path
from .views import personal_workspace, task_page, settings_page, save_task, get_tasks, delete_task, update_settings

urlpatterns = [
    path('', personal_workspace, name='personal_workspace'),
    path('task/', task_page, name='task_page'),
    path('settings/', settings_page, name='settings_page'),
    path('save-task/', save_task, name='save_task'),
    path('get-tasks/', get_tasks, name='get_tasks'),
    path('delete-task/<int:task_id>/', delete_task, name='delete_task'),
    path('update-settings/', update_settings, name='update_settings'),
]
