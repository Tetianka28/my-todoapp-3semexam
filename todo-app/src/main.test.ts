import { describe, it, expect} from 'vitest' //grabs info we need for testing the code
interface Todo{
    id:number,
    text:string,
    completed:boolean
}

const addTodo = (todos: Todo[], text:string) => {
    const newTodo:Todo = {
        id: 123,
        text,
        completed:false
    }
    return[...todos, newTodo] //dots are instead of writing all infos we need returned (id, text, completed)
}

const removeTodo = (todos: Todo[], id:number): Todo[] => { //here we call id again, because that's the only thing we need to run through, not the whole arrray of Todo
    return todos.filter(todo => todo.id !== id);
}

///---------------------------------------------------------------------------//////////////
///////////////// TESTING STRUCTURE : DESCRIBE - IT - EXPECT - TO BE//////////////////////
///-----------------------------------------------------------------------//////////////
describe(`addTod`, () => {
    it(`should add a new todo to the list`, () => {
        const todos: Todo[] = []; //this array is equal empty array
        const result = addTodo(todos, `Test todo`);
        expect(result.length).toBe(1) //length is the number of items in the array //to be 1 because we took empty array, added item so we expect there to be one as a result of testing
        expect(result[0].text).toBe(`Test todo`)
        expect(result[0].completed).toBe(false)
    })
})