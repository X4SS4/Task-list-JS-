// import { Task, TaskList } from "./globals";

document.addEventListener('DOMContentLoaded', function () {
  const taskList = new TaskList();
  const taskPropertySelect = document.getElementById('taskProperty-select');
  const taskSortSelect = document.getElementById('taskSort-select');
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
    let taskListDisplay = new TaskList();
    if (taskPropertySelect.value === 'done') {
      taskListDisplay.tasks = taskList.filterByCompletionStatus(true);
      console.log(taskList);
    } 
    else if (taskPropertySelect.value === 'remained') {
      taskListDisplay.tasks = taskList.filterByCompletionStatus(false);
    } 
    else {
      taskListDisplay = taskList;
    }
    
    if (taskSortSelect.value === 'byName') {
      taskListDisplay.sortByTitle();
    } 
    else if (taskSortSelect.value === 'byDate') {
      taskListDisplay.sortByCreationDate();
    } 


    taskListDisplay.tasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
      <a href="details/task-details.html?id=${task.id}">Task name: ${task.title}</a>
      <label for="checker"> Status: </label>
      <input type="checkbox" name="checker" ${task.isCompleted ? 'checked' : ''}></input>      
      <div>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
        <button class="edit-btn" data-id="${task.id}">Edit</button>
      </div>
      `;

      const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            task.toggleCompletion();
            saveTaskListToLocalStorage(); 
            renderTasks();
        });

      tasksContainer.appendChild(li);
    });
    
    
  }
  
  function openModal() {
    taskModal.style.display = 'block';
  }
  
  function closeModal() {
    taskModal.style.display = 'none';
    taskForm.reset();
  }
  
  tasksContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('edit-btn')) {
      const taskId = parseInt(event.target.dataset.id);
      window.location.href = `edit/task-edit.html?id=${taskId}`;
    }
  });
  
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
    saveTaskListToLocalStorage();
    closeModal();
  });

  tasksContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn')) {
      const taskId = parseInt(event.target.dataset.id);
      taskList.removeTask(taskId);
      renderTasks();
      saveTaskListToLocalStorage();
    }
  });

  taskPropertySelect.addEventListener('change', function () {
    renderTasks();
  });
  
  
  taskSortSelect.addEventListener('change', function () {
    renderTasks();
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