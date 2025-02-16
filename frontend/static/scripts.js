function openTaskEditor() {
    console.log("openTaskEditor function called");
    document.getElementById("task-editor").style.display = "block";
}

function closeTaskEditor() {
    document.getElementById("task-editor").style.display = "none";
}

function saveTask() {
    let taskContent = document.getElementById("task-content").value;

    if (taskContent.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    let taskId = document.getElementById("task-editor").dataset.editingTaskId;
    let url = taskId ? `/update-task/${taskId}/` : "/save-task/";
    let method = taskId ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ content: taskContent }),
    })
    .then(response => {
        console.log("Response status:", response.status);  // Debugging line
        return response.json();
    })
    .then(data => {
        console.log("Response data:", data);  // Debugging line
        if (data.message) {
            window.location.reload();
        } else {
            alert("Error saving task: " + data.error);
        }
    })
    .catch(error => {
        console.error("Network error:", error);  // Debugging line
        alert("Network error: " + error.message);
    });
}

function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        fetch(`/delete-task/${taskId}/`, {
            method: "POST", // Use POST instead of DELETE for Django compatibility
            headers: {
                "X-CSRFToken": getCSRFToken(),
            }
        })
        .then(response => {
            if (response.ok) {
                document.querySelector(`[data-task-id="${taskId}"]`).remove();
            } else {
                alert("Error deleting task!");
            }
        })
        .catch(error => {
            alert("Network error: " + error.message);
        });
    }
}

function viewTasks() {
    fetch("/get-tasks/")
        .then(response => response.json())
        .then(tasks => {
            let taskList = document.getElementById("task-list");
            taskList.innerHTML = ""; // Clear existing tasks
            tasks.forEach(task => {
                let taskItem = document.createElement("div");
                taskItem.className = "task-item";
                taskItem.dataset.taskId = task.id;

                let taskContent = document.createElement("span");
                taskContent.innerText = task.title;

                let editButton = document.createElement("button");
                editButton.className = "edit-btn";
                editButton.innerText = "✏️";
                editButton.onclick = () => editTask(editButton);

                let deleteButton = document.createElement("button");
                deleteButton.className = "delete-btn";
                deleteButton.innerText = "🗑️";
                deleteButton.onclick = () => deleteTask(task.id);

                taskItem.appendChild(taskContent);
                taskItem.appendChild(editButton);
                taskItem.appendChild(deleteButton);
                taskList.appendChild(taskItem);
            });
        })
        .catch(error => {
            alert("Error fetching tasks: " + error.message);
        });
}

function getCSRFToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    console.log("CSRF Token:", csrfToken);  // Debugging line
    return csrfToken;
}

function searchTasks() {
    let searchQuery = document.getElementById("search-bar").value.toLowerCase();
    let tasks = document.querySelectorAll(".task-item");

    tasks.forEach(task => {
        let taskText = task.innerText.toLowerCase();
        if (taskText.includes(searchQuery)) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
}

function editTask(button) {
    let taskItem = button.parentElement;
    let taskContent = taskItem.querySelector("span").innerText;
    let taskId = taskItem.dataset.taskId;

    openTaskEditor();
    document.getElementById("task-content").value = taskContent;
    document.getElementById("task-editor").dataset.editingTaskId = taskId;
}