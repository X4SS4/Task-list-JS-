document.addEventListener('DOMContentLoaded', function () {
  const taskId = getTaskIdFromUrl();
  const taskList = loadTaskListFromLocalStorage();
  const task = getTaskById(taskId, taskList);

  if (task) {
    displayTaskDetails(task);
    const taskDescriptionElement = document.getElementById('task-description');
    const taskStatusElement = document.getElementById('task-status');

    taskDescriptionElement.value = task.description;
    taskStatusElement.checked = task.isCompleted;

    document.getElementById('save-btn').addEventListener('click', function () {
      task.description = taskDescriptionElement.value;
      task.isCompleted = taskStatusElement.checked;
      saveTaskListToLocalStorage(taskList);
    });
  } else {
    const taskDetailsElement = document.querySelector('.task-details');
    taskDetailsElement.innerHTML = '<p>Task not found.</p>';
  }
});

function saveTaskListToLocalStorage(taskList) {
  localStorage.setItem('taskList', JSON.stringify(taskList.tasks));
}

function loadTaskListFromLocalStorage() {
  const savedTaskList = JSON.parse(localStorage.getItem('taskList'));
  if (savedTaskList) {
    const taskList = new TaskList();
    savedTaskList.forEach(taskData => {
      const task = new Task(
        taskData.id,
        taskData.title,
        taskData.description,
        taskData.creationDate,
        taskData.isCompleted
      );
      taskList.addTask(task);
    });
    return taskList;
  }
  return null;
}


function getTaskIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function getTaskById(id, taskList) {
  return taskList.getTaskById(parseInt(id));
}

function displayTaskDetails(task) {
  const taskTitleElement = document.getElementById('task-title');
  const taskDescriptionElement = document.getElementById('task-description');
  const taskCreationDateElement = document.getElementById('task-creation-date');
  const taskStatusElement = document.getElementById('task-status');

  taskTitleElement.textContent = task.title;
  taskDescriptionElement.textContent = task.description;
  taskCreationDateElement.textContent = `Created at: ${task.creationDate}`;
  taskStatusElement.textContent = `Status: ${task.isCompleted ? 'Done' : 'Remained'}`;
}


class Task {
  constructor(id, title, description, creationDate, isCompleted) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.creationDate = creationDate;
    this.isCompleted = isCompleted;
  }

  toggleCompletion() {
    this.isCompleted = !this.isCompleted;
  }
}


class TaskList {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  getTaskById(id) {
    return this.tasks.find(task => task.id === id);
  }

  filterByCompletionStatus(isCompleted) {
    return this.tasks.filter(task => task.isCompleted === isCompleted);
  }

  sortByTitle() {
    this.tasks.sort((a, b) => a.title.localeCompare(b.title));
  }

  sortByCreationDate() {
    this.tasks.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
  }
}