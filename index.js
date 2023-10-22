

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