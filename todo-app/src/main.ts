import './style.css'

//structure of the data schema

/**
 * A single todo item.
 * @property id - unique id, created with Date.now()
 * @property text - what the user typed
 * @property completed - true when the todo is done
 * @property priority - optional, older saved todos may not have one
 */
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority?: Priority; 

}

/** The three priority levels a todo can have. */
type Priority = "Low" | "Medium" | "High";

/** Key used to store the todos in the browser's local storage. */
const STORAGE_KEY = "todos";


/**
 * Saves the current todos list to local storage as a JSON string.
 */
/**
 * Writes the current list to the browser as a JSON string.
 */
const saveTodos = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

/**
 * Reads the todos from local storage.
 * @returns the saved todos, or an empty array if nothing is saved yet
 */
const loadTodos = (): Todo[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? (JSON.parse(saved) as Todo[]) : [];
};

let todos: Todo[] = loadTodos();

// let todos: Todo[] = [];

const todoInput = document.getElementById("todo-input") as HTMLInputElement
const todoForm = document.querySelector(".todo-form") as HTMLFormElement
const todoList = document.getElementById("todo-list") as HTMLUListElement
const clearCompletedBtn = document.getElementById("clear-completed-btn") as HTMLButtonElement
const prioritySelect = document.getElementById("priority-select") as HTMLSelectElement
/** Sort order for priorities: a lower number is shown first. */
const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }
const searchInput = document.getElementById("search-input") as HTMLInputElement
let searchQuery: string = ""


/**
 * Removes the todo with the given id and re-renders the list.
 * @param id - the id of the todo to remove
 */

const removeTodo = (id: number): void => {
  todos = todos.filter(todo => todo.id !== id)
  renderTodos()
}

/**
 * Flips the completed status of the todo with the given id.
 * @param id - the id of the todo to toggle
 */
const toggleTodo = (id: number): void => {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
  renderTodos()
}


/**
 * Removes every completed todo from the list.
 */
const clearCompleted = (): void => {
  todos = todos.filter(todo => !todo.completed)
  renderTodos()
}

/**
 * Connects the Remove button of one list item to removeTodo.
 * @param li - the list item that contains the button
 * @param id - the id of the todo shown in that item
 */

const addRemoveButtonListener = (li: HTMLLIElement, id: number): void => {
  const removeButton = li.querySelector(".remove-btn")
  removeButton?.addEventListener("click", () => removeTodo(id))
}

/**
 * Connects the Done/Undo button of one list item to toggleTodo.
 * @param li - the list item that contains the button
 * @param id - the id of the todo shown in that item
 */

const addToggleButtonListener = (li: HTMLLIElement, id: number): void => {
  const toggleButton = li.querySelector(".toggle-btn")
  toggleButton?.addEventListener("click", () => toggleTodo(id))
}


/**
 * Filters todos by search text, ignoring upper and lower case.
 * @param list - the todos to search in
 * @param query - the text typed in the search field
 * @returns the todos whose text contains the query, or the full list if the query is empty
 */
const filterBySearch = (list: Todo[], query: string): Todo[] => {
  const q = query.trim().toLowerCase()
  if (q === "") return list
  return list.filter(todo => todo.text.toLowerCase().includes(q))
}

/**
 * Saves the todos, applies the search filter, sorts by priority
 * and draws every todo in the list.
 */

const renderTodos = (): void => {
  saveTodos()
  const visibleTodos = filterBySearch(todos, searchQuery)
  todoList.innerHTML = ""
  

  const sortedTodos = [...visibleTodos].sort(
    (a, b) => priorityOrder[a.priority ?? "Low"] - priorityOrder[b.priority ?? "Low"]
  )

  sortedTodos.forEach(todo => {
    const priority = todo.priority ?? "Low"   // ?? gives a default if priority is missing
    const li = document.createElement("li")
    li.className = `todo-item todo-${priority}`
    li.innerHTML = `
      <span class="${todo.completed ? "completed" : ""}">${todo.text}</span>
      <span class="priority priority-${priority}">${priority}</span>
      <button class="toggle-btn">${todo.completed ? "Undo" : "Done"}</button>
      <button class="remove-btn">Remove</button>
    `
    addToggleButtonListener(li, todo.id)
    addRemoveButtonListener(li, todo.id)
    todoList.appendChild(li)
  })
}

/**
 * Creates a new todo, adds it to the list and re-renders.
 * @param text - the text of the todo
 * @param priority - the priority chosen in the dropdown
 */

const addTodo = (text: string, priority: Priority): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text,
    completed: false,
    priority: priority,
  }
  todos.push(newTodo)
  renderTodos()
}

todoForm.addEventListener("submit", (event: Event) => {
  event.preventDefault()
  const text = todoInput.value.trim()
  if (text !== "") {
    addTodo(text, prioritySelect.value as Priority)
    todoInput.value = ""
  } else {
    todoInput.classList.add("input-error")
    const errorMessage = document.getElementById("error-message")
    if (errorMessage) {
      errorMessage.style.display = "block"
    }
  }
})

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value
  renderTodos()
})

clearCompletedBtn.addEventListener("click", clearCompleted)


renderTodos()