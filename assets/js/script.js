// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null) {
        nextId = 1;
    } else {
        nextId++;
    }

    localStorage.setItem("nextId", JSON.stringify(nextId));

    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const newDiv = $('<div>').addClass('card');
    const cardTitle = $('<h5>').addClass('card-title');
    const dueDate = $('<p>').addClass('due-date');
    const cardBody = $('<p>').addClass('card-body');
    const cardButton = $('<button>').addClass('card-button');

    cardTitle.append(task.taskTitle);
    dueDate.append(task.taskDueDate);
    cardBody.append(task.taskDescription);
    cardButton.append('delete');



    newDiv.append(cardTitle, dueDate, cardBody, cardButton);
    $('#todo-cards').append(newDiv);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const tasksStorage = JSON.parse(localStorage.getItem('tasks')) || []
    const taskTitle = $('#taskTitle').val();
    const taskDueDate = $('#taskDueDate').val();
    const taskDescription = $('#taskDescription').val();

    const task = {
        id: generateTaskId(),
        taskTitle,
        taskDueDate,
        taskDescription,
    }

    tasksStorage.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasksStorage));

    createTaskCard(task);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

$('#submitTaskButton').on('click', handleAddTask);

});

