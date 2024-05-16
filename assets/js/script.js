$(document).ready(function () {
  // Function to retrieve tasks from localStorage
  function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  // Function to generate a unique task id
  function generateTaskId() {
    let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
    localStorage.setItem("nextId", JSON.stringify(nextId + 1));
    return nextId;
  }

  // Function to render a task card
  function renderTaskCard(task) {
    const card = $('<div>')
      .addClass('card task-card')
      .attr('data-task-id', task.id)
      .addClass(task.taskDueDate ? (dayjs(task.taskDueDate).isBefore(dayjs(), 'day') ? 'card-danger' : (dayjs(task.taskDueDate).diff(dayjs(), 'day') <= 2 ? 'card-warning' : '')) : '');

    const cardTitle = $('<h5>').addClass('card-title').text(task.taskTitle);
    const cardBody = $('<p>').addClass('card-body').text(task.taskDescription);
    const dueDate = $('<p>').addClass('due-date').text(task.taskDueDate);
    const cardButton = $('<button>')
      .addClass('btn btn-danger delete-button mx-auto')
      .css('width', '80px') // Narrow the width of the delete button
      .text('Delete');

    card.append(cardTitle, cardBody, dueDate, cardButton);
    return card;
  }

  // Function to render the task list
  function renderTaskList(tasks) {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    tasks.forEach(task => {
      const card = renderTaskCard(task);
      $('#' + task.lane + '-cards').append(card);
    });

    makeCardsDraggable();
  }

  // Function to make task cards draggable
  function makeCardsDraggable() {
    $('.task-card').draggable({
      revert: 'invalid',
      containment: '.swim-lanes', // Restrict dragging within swim-lanes
      cursor: 'grabbing',
      stack: '.task-card',
    });
  }

  // Function to handle adding a new task
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
      lane: 'todo', // Default lane is 'todo'
    };

    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const card = renderTaskCard(task);
    $('#todo-cards').append(card);

    $('#formModal').modal('hide');
    $('#taskTitle').val('');
    $('#taskDueDate').val('');
    $('#taskDescription').val('');

    makeCardsDraggable();
  }

  // Function to handle deleting a task
  function handleDeleteTask() {
    const taskId = $(this).closest('.task-card').attr('data-task-id');
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id != taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTaskList(tasks);
  }

  // Initialize the page
  const tasks = getTasksFromLocalStorage();
  renderTaskList(tasks);

  // Make swim lanes droppable
  $('.lane').droppable({
    drop: function (event, ui) {
      const taskId = ui.draggable.attr('data-task-id');
      const targetLane = $(this).attr('id');
      let tasks = getTasksFromLocalStorage();

      // Update task's lane in localStorage
      const taskIndex = tasks.findIndex(task => task.id == taskId);
      tasks[taskIndex].lane = targetLane;
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // If task is moved to "Done" column, change background color to white
      if (targetLane === 'done') {
        ui.draggable.removeClass('card-warning card-danger').css('background-color', 'white');
      } else {
        ui.draggable.css('background-color', '');
      }
    },
    containment: '.swim-lanes', // Restrict dropping within swim-lanes
  });

  // Make the due date field a date picker
  $('#taskDueDate').datepicker();

  // Add event listener for adding a new task
  $('#submitTaskButton').on('click', handleAddTask);

  // Add event listener for deleting a task
  $(document).on('click', '.delete-button', handleDeleteTask);
});
