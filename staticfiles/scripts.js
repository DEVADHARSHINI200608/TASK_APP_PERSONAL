function openTaskPage() {
    window.location.href = "/task/";
}

function openSettings() {
    window.location.href = "/settings/";
}

function saveTask() {
    let taskContent = document.getElementById("task-content").value;
    
    if (taskContent.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }
    
    fetch("/save-task/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ content: taskContent }),
    }).then(response => {
        if (response.ok) {
            window.location.href = "/";
        } else {
            alert("Error saving task!");
        }
    });
}

function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}