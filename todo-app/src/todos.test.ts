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