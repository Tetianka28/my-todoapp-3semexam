/** The three priority levels a todo can have. */
export type Priority = "Low" | "Medium" | "High";

/** A single todo item. */
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority?: Priority;
}

/** Sort order for priorities: a lower number is shown first. */
export const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

/**
 * Sorts todos by priority, highest first. The original array is not changed.
 * @param list - the todos to sort
 * @returns a new array ordered High, Medium, Low
 */
export const sortByPriority = (list: Todo[]): Todo[] =>
  [...list].sort(
    (a, b) => priorityOrder[a.priority ?? "Low"] - priorityOrder[b.priority ?? "Low"]
  );

/**
 * Filters todos by search text, ignoring upper and lower case.
 * @param list - the todos to search in
 * @param query - the text typed in the search field
 * @returns the matching todos, or the full list if the query is empty
 */
export const filterBySearch = (list: Todo[], query: string): Todo[] => {
  const q = query.trim().toLowerCase();
  if (q === "") return list;
  return list.filter(todo => todo.text.toLowerCase().includes(q));
};