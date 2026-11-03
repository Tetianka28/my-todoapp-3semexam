import './style.css'


//structure of the data schema
interface Todo {
  id:number;
  text:string;
  completed:boolean;
}

let todos: Todo[] = [];

const todoInput = document.getElementById("todo-input") as HTMLInputElement
const todoForm = document.querySelector(".todo-form") as HTMLFormElement
const todoList = document.getElementById("todo-list") as HTMLUListElement

const addTodo = (text:string):void => { //void because we are not doing a return here
  const newTodo: Todo = {
    id: Date.now(), //gguid - generated random id,can be better practice than Date.now
    text: text,
    completed: false, //as a default we don't want them to be completed when we creating them
  };

  todos.push(newTodo);
  //push so the info we are holding is pushed through the array todos
  console.log(`Todo added: ${todos}`);

  renderTodos();
  //will reload changes and display dynamically on the page
}

const renderTodos = ():void => {
  //clears the current list - test later to see changes
  todoList.innerHTML = ""; //blank as a default

  todos.forEach(todo => {
    const li = document.createElement("li")
    li.className = "todo-item"
    li.innerHTML = `
      <span>${todo.text}</span>
      <button>Remove</button>    
    `
    addRemoveButtonListener(li, todo.id); //we mention which id has to be removed so it doesn't just remove last one
    todoList.appendChild(li) //because ul is the parent element so li is a child
  })
}

renderTodos(); //we force the updated through with this when new info appears

//fires a submit button
todoForm.addEventListener("submit", (event:Event) => {
  //we write a code now that stops page from refreshing every time we press Add button
  event.preventDefault();
  //thi step not necessary - to remove space %20 when ppl type it in
  const text = todoInput.value.trim() //trim means remove spaces
  //function to not store an empty todo
  if (text !== "") {
    addTodo(text)
    //next line clears the input field after we submitted, so we don't have to remove old before putting new
    todoInput.value = "";
  }

});

const errorMessage = document.getElementById("error-message") as HTMLParagraphElement  //link to the html

const addRemoveButtonListener = (li:HTMLLIElement, id:number):void => {
  const removeButton = li.querySelector("button");
  removeButton?.addEventListener("click", () => removeTodo(id))
}

const removeTodo = (id:number):void => {
  todos = todos.filter(todo => todo.id !== id)
  renderTodos()
}

