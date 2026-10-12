
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

// Update the empty-list message
function updateEmptyMessage() {
    emptyMessage.style.display =
        taskList.children.length === 0 ? "block" : "none";
}

// Create and add a task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Do not allow empty tasks
    if (taskText === "") {
        taskInput.focus();
        return;
    }

    // Create the task item
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    // Create the task name
    const taskName = document.createElement("span");
    taskName.classList.add("task-name");
    taskName.textContent = taskText;

    // Create the action buttons container
    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    // Create the Complete button
    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.textContent = "Complete";
    completeButton.classList.add("complete-btn");

    // Complete the task
    completeButton.addEventListener("click", function () {
        taskItem.classList.add("completed");
        taskName.classList.add("completed-text");

        completeButton.textContent = "Completed";
        completeButton.disabled = true;
        completeButton.classList.add("completed-btn");
    });

    // Create the Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    // Delete the task
    deleteButton.addEventListener("click", function () {
        taskItem.remove();
        updateEmptyMessage();
    });

    // Assemble the task
    taskActions.appendChild(completeButton);
    taskActions.appendChild(deleteButton);

    taskItem.appendChild(taskName);
    taskItem.appendChild(taskActions);

    // Add task to the list
    taskList.appendChild(taskItem);

    // Clear input and update the page
    taskInput.value = "";
    updateEmptyMessage();
    taskInput.focus();
});

// Initialize the page
updateEmptyMessage();
