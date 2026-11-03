import './style.css'

//structure of the data schema
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority?: Priority; 

}
type Priority = "Low" | "Medium" | "High";

const STORAGE_KEY = "todos";

// writes the current list to the browser as a JSON string
const saveTodos = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

// reads the list back, or returns an empty list if nothing is saved yet
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
const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 }
const searchInput = document.getElementById("search-input") as HTMLInputElement
let searchQuery: string = ""

const removeTodo = (id: number): void => {
  todos = todos.filter(todo => todo.id !== id)
  renderTodos()
}

// flips completed true/false for the todo with the matching id
const toggleTodo = (id: number): void => {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
  renderTodos()
}

// removes every todo where completed is true
const clearCompleted = (): void => {
  todos = todos.filter(todo => !todo.completed)
  renderTodos()
}

const addRemoveButtonListener = (li: HTMLLIElement, id: number): void => {
  const removeButton = li.querySelector(".remove-btn")
  removeButton?.addEventListener("click", () => removeTodo(id))
}

const addToggleButtonListener = (li: HTMLLIElement, id: number): void => {
  const toggleButton = li.querySelector(".toggle-btn")
  toggleButton?.addEventListener("click", () => toggleTodo(id))
}


// returns only the todos whose text contains the query (not case sensitive)
const filterBySearch = (list: Todo[], query: string): Todo[] => {
  const q = query.trim().toLowerCase()
  if (q === "") return list
  return list.filter(todo => todo.text.toLowerCase().includes(q))
}

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