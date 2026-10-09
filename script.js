
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        taskInput.focus();
        return;
    }

    // Create a new list item
    const taskItem = document.createElement("li");
    taskItem.textContent = taskText;

    // Add the task to the list
    taskList.appendChild(taskItem);

    // Hide the empty-state message
    emptyMessage.style.display = "none";

    // Clear the input field
    taskInput.value = "";
    taskInput.focus();
});