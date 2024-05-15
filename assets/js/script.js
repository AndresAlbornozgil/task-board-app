// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Create a function to generate a unique task id
function generateTaskId() {
  const id = nextId;
  nextId++;
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return id;
}

// Create a function to create a task card
function createTaskCard(task) {
  const card = $('<div>')
    .addClass('card task-card')
    .attr('data-task-id', task.id)
    .addClass(task.taskDueDate ? (dayjs(task.taskDueDate).isBefore(dayjs(), 'day') ? 'card-danger' : (dayjs(task.taskDueDate).diff(dayjs(), 'day') <= 2 ? 'card-warning' : '')) : '');

  const cardTitle = $('<h5>').addClass('card-title').text(task.taskTitle);
  const dueDate = $('<p>').addClass('due-date').text(task.taskDueDate);
  const cardBody = $('<p>').addClass('card-body').text(task.taskDescription);
  const cardButton = $('<button>')
    .addClass('btn btn-danger delete-button')
    .text('Delete');

  card.append(cardTitle, dueDate, cardBody, cardButton);
  $('#todo-cards').append(card);
}

// Create a function to render the task list
function renderTaskList() {
  $('#todo-cards').empty();
  $('#in-progress-cards').empty();
  $('#done-cards').empty();

  taskList.forEach(task => {
    createTaskCard(task);
  });
}

// Create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const taskTitle = $('#taskTitle').val().trim();
  const taskDueDate = $('#taskDueDate').val().trim();
  const taskDescription = $('#taskDescription').val().trim();

  if (!taskTitle) {
    alert('Task title is required.');
    return;
  }

  const task = {
    id: generateTaskId(),
    taskTitle,
    taskDueDate,
    taskDescription,
  };

  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));

  createTaskCard(task);

  $('#formModal').modal('hide');
  $('#taskTitle').val('');
  $('#taskDueDate').val('');
  $('#taskDescription').val('');
}

// Create a function to handle deleting a task
function handleDeleteTask() {
  const taskId = $(this).closest('.task-card').attr('data-task-id');
  taskList = taskList.filter(task => task.id != taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr('data-task-id');
  const targetLane = $(this).attr('id');
  const taskIndex = taskList.findIndex(task => task.id == taskId);
  taskList[taskIndex].lane = targetLane;
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Initialize the page
$(document).ready(function () {
  renderTaskList();

  // Make task cards draggable
  $('.task-card').draggable({
    revert: true,
    revertDuration: 0,
    containment: '.swim-lanes',
    cursor: 'grabbing',
    stack: '.task-card',
  });

  // Make swim lanes droppable
  $('.lane').droppable({
    drop: handleDrop,
  });

  // Make the due date field a date picker
  $('#taskDueDate').datepicker();

  // Add event listener for adding a new task
  $('#submitTaskButton').on('click', handleAddTask);

  // Add event listener for deleting a task
  $(document).on('click', '.delete-button', handleDeleteTask);
});
