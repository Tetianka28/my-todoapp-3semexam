import './style.css'

//structure of the data schema
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

let todos: Todo[] = [];

const todoInput = document.getElementById("todo-input") as HTMLInputElement
const todoForm = document.querySelector(".todo-form") as HTMLFormElement
const todoList = document.getElementById("todo-list") as HTMLUListElement

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

const addRemoveButtonListener = (li: HTMLLIElement, id: number): void => {
  const removeButton = li.querySelector(".remove-btn")
  removeButton?.addEventListener("click", () => removeTodo(id))
}

const addToggleButtonListener = (li: HTMLLIElement, id: number): void => {
  const toggleButton = li.querySelector(".toggle-btn")
  toggleButton?.addEventListener("click", () => toggleTodo(id))
}

const renderTodos = (): void => {
  todoList.innerHTML = ""

  todos.forEach(todo => {
    const li = document.createElement("li")
    li.className = "todo-item"
    li.innerHTML = `
      <span class="${todo.completed ? "completed" : ""}">${todo.text}</span>
      <button class="toggle-btn">${todo.completed ? "Undo" : "Done"}</button>
      <button class="remove-btn">Remove</button>
    `
    addToggleButtonListener(li, todo.id)
    addRemoveButtonListener(li, todo.id)
    todoList.appendChild(li)
  })
}

const addTodo = (text: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text,
    completed: false,
  }
  todos.push(newTodo)
  renderTodos()
}

todoForm.addEventListener("submit", (event: Event) => {
  event.preventDefault()
  const text = todoInput.value.trim()
  if (text !== "") {
    addTodo(text)
    todoInput.value = ""
  } else {
    todoInput.classList.add("input-error")
    const errorMessage = document.getElementById("error-message")
    if (errorMessage) {
      errorMessage.style.display = "block"
    }
  }
})

renderTodos()