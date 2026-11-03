/* import { describe, it, expect} from 'vitest' //grabs info we need for testing the code
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
 */
///---------------------------------------------------------------------------//////////////
///////////////// TESTING STRUCTURE : DESCRIBE - IT - EXPECT - TO BE//////////////////////
///-----------------------------------------------------------------------//////////////
/* describe(`addTod`, () => {
    it(`should add a new todo to the list`, () => {
        const todos: Todo[] = []; //this array is equal empty array
        const result = addTodo(todos, `Test todo`);
        expect(result.length).toBe(1) //length is the number of items in the array //to be 1 because we took empty array, added item so we expect there to be one as a result of testing
        expect(result[0].text).toBe(`Test todo`)
        expect(result[0].completed).toBe(false)
    })
}) */
import { describe, it, expect } from "vitest";
import type { Todo, Priority } from './todos'
import { sortByPriority, filterBySearch } from './todos'

const make = (id: number, text: string, priority?: Todo["priority"]): Todo => ({
  id,
  text,
  completed: false,
  priority,
});

describe("sortByPriority", () => {
  it("puts High first, then Medium, then Low", () => {
    const list = [make(1, "a", "Low"), make(2, "b", "High"), make(3, "c", "Medium")];
    expect(sortByPriority(list).map(t => t.priority)).toEqual(["High", "Medium", "Low"]);
  });

  it("treats a missing priority as Low", () => {
    const list = [make(1, "a"), make(2, "b", "High")];
    expect(sortByPriority(list)[0].id).toBe(2);
  });

  it("does not change the original array", () => {
    const list = [make(1, "a", "Low"), make(2, "b", "High")];
    sortByPriority(list);
    expect(list[0].id).toBe(1);
  });
});

describe("filterBySearch", () => {
  const list = [make(1, "Buy milk"), make(2, "Clean room"), make(3, "Call mom")];

  it("returns matching todos", () => {
    expect(filterBySearch(list, "mi").map(t => t.id)).toEqual([1]);
  });

  it("ignores upper and lower case", () => {
    expect(filterBySearch(list, "CLEAN")).toHaveLength(1);
  });

  it("returns everything for an empty query", () => {
    expect(filterBySearch(list, "  ")).toHaveLength(3);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterBySearch(list, "xyz")).toEqual([]);
  });
});