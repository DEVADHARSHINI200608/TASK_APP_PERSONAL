
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Task
from django.utils import timezone
from django.contrib.auth.models import User

@login_required
def personal_workspace(request):
    """Display the personal workspace with tasks."""
    tasks = Task.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'personal_workspace.html', {'tasks': tasks})

@login_required
def task_page(request):
    """Display the task creation/edit page."""
    return render(request, 'task_page.html')

@login_required
def settings_page(request):
    """Display the settings page where users can edit name & department."""
    return render(request, 'settings_page.html')

@csrf_exempt
@login_required
def save_task(request):
    if request.method == "POST":
        data = json.loads(request.body)
        print("Received data:", data)  # Debugging line
        task_content = data.get("content", "")
        user_id = request.user.id

        if task_content:
            user = User.objects.get(id=user_id)
            Task.objects.create(user=user, title=task_content)
            print("Task saved successfully!")  # Debugging line
            return JsonResponse({"message": "Task saved successfully!"})
        else:
            return JsonResponse({"error": "Task content is empty!"}, status=400)

    return JsonResponse({"error": "Invalid request!"}, status=400)


@login_required
def get_tasks(request):
    """Fetch tasks associated with the logged-in user."""
    tasks = Task.objects.filter(user=request.user).values("id", "title", "created_at", "is_starred")
    return JsonResponse(list(tasks), safe=False)

@csrf_exempt
@login_required
def delete_task(request, task_id):
    """Delete a task associated with the logged-in user."""
    try:
        task = Task.objects.get(id=task_id, user=request.user)
        task.delete()
        return JsonResponse({"message": "Task deleted successfully!"})
    except Task.DoesNotExist:
        return JsonResponse({"error": "Task not found or you do not have permission to delete it!"}, status=404)

@login_required
def update_settings(request):
    """Handle updating user settings (name & department)."""
    if request.method == "POST":
        user = request.user
        user.first_name = request.POST.get('name', user.first_name)
        user.profile.department = request.POST.get('department', user.profile.department)
        user.save()
        return redirect('personal_workspace')
    
    return redirect('settings_page')
