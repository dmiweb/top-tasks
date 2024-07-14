import "./render-task.css";
import Task from "../task/task";

export default class TaskList {
  constructor(element) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }

    this._element = element;

    this._addTask = this._addTask.bind(this);
    this.pinTask = this.pinTask.bind(this);
    this._filterTasks = this._filterTasks.bind(this);

    this.noTasksMessage = this._element.querySelector(".no-tasks-message");
    this.noPinTasksMessage = this._element.querySelector(
      ".no-pin-tasks-message",
    );

    this.taskList = this._element.querySelector(".task-list");
    this.pinList = this._element.querySelector(".pinned-task-list");
    this.taskBuffer = [];

    this._element.addEventListener("click", this.pinTask);
  }

  showNoTaskMessage() {
    const noTaskMessage = `<span class="no-tasks-message">"No tasks found"</span>`;
    this.taskList.insertAdjacentHTML("beforeEnd", noTaskMessage);
  }

  showNoPinTaskMessage() {
    const noPinTaskMessage = `<span class="no-pin-tasks-message">"No pinned tasks"</span>`;
    this.pinList.insertAdjacentHTML("beforeEnd", noPinTaskMessage);
  }

  renderTask(id, text) {
    return `<li id="${id}" class="task">
              ${text}
              <label>
                <input type="checkbox" class="task-checkbox">
                  <span class="custom-checkbox"></span>
              </label>
            </li>`;
  }

  restoreSaveTasks() {
    try {
      return JSON.parse(localStorage.getItem("task"));
    } catch {
      return null;
    }
  }

  saveTasks() {
    localStorage.setItem("task", JSON.stringify(this.taskBuffer));
  }

  reloadTaskList() {
    this.taskBuffer = this.restoreSaveTasks();

    if (!this.taskBuffer) this.taskBuffer = [];
    if (!this.taskBuffer.length) {
      this.showNoPinTaskMessage();
      this.showNoTaskMessage();
      return;
    }

    this.pinList.innerHTML = "";
    this.taskList.innerHTML = "";

    this.taskBuffer.forEach((task) => {
      const taskElement = this.renderTask(task.id, task.text);

      if (task.pin === true) {
        this.pinList.insertAdjacentHTML("beforeEnd", taskElement);
      } else {
        this.taskList.insertAdjacentHTML("beforeEnd", taskElement);
      }
    });

    [...this.pinList.children].forEach((child) => {
      child.querySelector(".task-checkbox").setAttribute("checked", "checked");
    });

    if (!this.pinList.children.length) this.showNoPinTaskMessage();
    if (!this.taskList.children.length) this.showNoTaskMessage();
  }

  _addTask(text) {
    const task = new Task(text);

    this.taskBuffer.push(task);

    this.saveTasks();

    this.reloadTaskList();
  }

  pinTask(e) {
    const currentElement = e.target;

    if (currentElement.classList.contains("task-checkbox")) {
      const taskElement = currentElement.closest(".task");

      this.taskBuffer.forEach((task) => {
        if (task.id === +taskElement.id) {
          if (!task.pin) {
            task.pin = true;
          } else {
            task.pin = false;
          }
        }
      });

      this.saveTasks();
      this.reloadTaskList();
    }

    const inputFormElement = document.querySelector(".add-filter-text");

    if (inputFormElement.value) {
      this._filterTasks(inputFormElement.value);
    }
  }

  _filterTasks(text) {
    let buffer = this.restoreSaveTasks();

    if (!buffer) buffer = [];

    const filterBuffer = buffer.filter((task) => {
      if (!task.pin) {
        const taskText = task.text.toLowerCase();
        const inputText = text.toLowerCase();

        if (taskText.startsWith(inputText)) {
          return buffer;
        }
      }
    });

    this.taskList.innerHTML = "";

    if (!filterBuffer.length) this.showNoTaskMessage();

    filterBuffer.forEach((task) => {
      const taskElement = this.renderTask(task.id, task.text);
      this.taskList.insertAdjacentHTML("beforeEnd", taskElement);
    });
  }
}
