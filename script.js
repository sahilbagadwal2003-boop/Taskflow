
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

// Show or hide the empty-list message
function updateEmptyMessage() {
    emptyMessage.style.display =
        taskList.children.length === 0 ? "block" : "none";
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        taskInput.focus();
        return;
    }

    // Create the task list item
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    // Create the task text
    const taskName = document.createElement("span");
    taskName.classList.add("task-name");
    taskName.textContent = taskText;

    // Create the Complete button
    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.textContent = "Complete";
    completeButton.classList.add("complete-btn");

    // Complete the task when clicked
    completeButton.addEventListener("click", function () {
        taskItem.classList.add("completed");
        taskName.classList.add("completed-text");

        completeButton.textContent = "Completed";
        completeButton.disabled = true;
        completeButton.classList.add("completed-btn");
    });

    // Add the task name and button to the task item
    taskItem.appendChild(taskName);
    taskItem.appendChild(completeButton);

    // Add the task to the list
    taskList.appendChild(taskItem);

    // Clear the input and update the page
    taskInput.value = "";
    updateEmptyMessage();
    taskInput.focus();
});

// Initialize the empty-list message
updateEmptyMessage();
