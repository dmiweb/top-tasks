import "./add-filter-task.css";

export default class AddFilterTask {
  constructor(element, addTaskHendler, filterHandler) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }

    this._element = element;
    this.addTask = addTaskHendler;
    this._filterHandler = filterHandler;

    this.onAddTask = this.onAddTask.bind(this);
    this.onFilter = this.onFilter.bind(this);

    this.form = this._element.querySelector(".add-filter-widget-form");
    this.input = this._element.querySelector(".add-filter-text");

    this.form.addEventListener("submit", this.onAddTask);
    this.input.addEventListener("input", this.onFilter);
  }

  onAddTask(e) {
    e.preventDefault();

    const text = this.input.value;

    this.addTask(text);

    this.form.reset();
  }

  onFilter(e) {
    e.preventDefault();

    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    const text = this.input.value;

    this._timeout = setTimeout(() => this._filterHandler(text), 0);
  }
}
