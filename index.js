// import { Task, TaskList } from "./globals";

document.addEventListener('DOMContentLoaded', function () {
  const taskList = new TaskList();
  const tasksContainer = document.getElementById('tasks-container');
  const taskForm = document.getElementById('task-form');
  const taskModal = document.getElementById('task-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const addTaskBtn = document.getElementById('add-task-btn');
  
  
  const savedTaskList = JSON.parse(localStorage.getItem('taskList'));
  if (savedTaskList) {
    loadTaskListFromLocalStorage();
    renderTasks();
  }
  
  function saveTaskListToLocalStorage() {
    localStorage.setItem('taskList', JSON.stringify(taskList.tasks));
  }
  
  function loadTaskListFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('taskList'));
    if (savedTasks) {
      savedTasks.forEach(taskData => {
        const task = new Task(
          taskData.id,
          taskData.title,
          taskData.description,
          taskData.creationDate,
          taskData.isCompleted
          );
        taskList.addTask(task);
      });
    }
  }


  function renderTasks() {
    tasksContainer.innerHTML = '';
    taskList.tasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
      <a href="details/task-details.html?id=${task.id}">Task name: ${task.title}</a>
      <label for="checker"> Done: </label>
      <input type="checkbox" name="checker"></checkbox>
      <div>
      <button class="delete-btn" data-id="${task.id}">Delete</button>
      <button class="edit-btn" data-id="${task.id}">Edit</button>
      </div>
      `;
      tasksContainer.appendChild(li);
    });
    saveTaskListToLocalStorage();
  }
  
  function openModal() {
    taskModal.style.display = 'block';
  }
  
  function closeModal() {
    taskModal.style.display = 'none';
    taskForm.reset();
  }
  
  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const id = (Date.now()) * 2; // generation id by date for begin
    const creationDate = new Date().toLocaleString();
    const isCompleted = false;
    
    const newTask = new Task(id, title, description, creationDate, isCompleted);
    taskList.addTask(newTask);
    
    renderTasks();
    closeModal();
  });

  tasksContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
      const taskId = parseInt(event.target.dataset.id);
      taskList.removeTask(taskId);
      renderTasks();
    }
  });
  
  closeModalBtn.addEventListener('click', closeModal);
  addTaskBtn.addEventListener('click', openModal);

})

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