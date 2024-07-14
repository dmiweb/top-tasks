import TaskList from "./components/render-task/task-list";
import AddFilterTask from "./components/add-filter-task/add-filter-task";

document.addEventListener("DOMContentLoaded", () => {
  const taskList = new TaskList(".task-container");

  taskList.reloadTaskList();

  new AddFilterTask(
    ".add-filter-widget",
    taskList._addTask,
    taskList._filterTasks,
  );
});
