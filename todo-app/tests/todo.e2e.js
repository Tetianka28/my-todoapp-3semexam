import { Selector } from 'testcafe';

const URL = 'http://localhost:5173/';

// ============================================================
// HELPERS (shared by all tests)
// ============================================================

const todoItems = Selector('.todo-item');

/** Types a todo, picks a priority and submits the form. */
const addTodo = async (t, text, priority = 'Medium') => {
  await t
    .typeText('#todo-input', text)
    .click('#priority-select')
    .click(Selector('#priority-select option').withText(priority))
    .click('.todo-form button[type="submit"]');
};

// ============================================================
// FEATURE: ADD TODO
// ============================================================
fixture`Feature: Add todo`.page(URL);

test('a new todo appears in the list', async t => {
  await addTodo(t, 'Buy milk');
  await t.expect(todoItems.count).eql(1);
  await t.expect(todoItems.innerText).contains('Buy milk');
});

test('the input field is cleared after adding', async t => {
  await addTodo(t, 'Buy milk');
  await t.expect(Selector('#todo-input').value).eql('');
});

// ============================================================
// FEATURE: REMOVE TODO
// ============================================================
fixture`Feature: Remove todo`.page(URL);

test('remove button deletes the todo', async t => {
  await addTodo(t, 'Buy milk');
  await t.click('.remove-btn');
  await t.expect(todoItems.count).eql(0);
});

test('remove button deletes only the chosen todo', async t => {
  await addTodo(t, 'Buy milk');
  await addTodo(t, 'Clean room');
  await t.click(todoItems.withText('Buy milk').find('.remove-btn'));
  await t.expect(todoItems.count).eql(1);
  await t.expect(todoItems.innerText).contains('Clean room');
});

// ============================================================
// FEATURE: TOGGLE COMPLETED STATUS
// ============================================================
fixture`Feature: Toggle completed`.page(URL);

test('clicking the toggle button marks the todo as done', async t => {
  await addTodo(t, 'Buy milk');
  await t.click('.toggle-btn');
  await t.expect(Selector('.todo-item .completed').exists).ok();
});

test('clicking the toggle button twice marks the todo as not done', async t => {
  await addTodo(t, 'Buy milk');
  await t.click('.toggle-btn').click('.toggle-btn');
  await t.expect(Selector('.todo-item .completed').exists).notOk();
});

// ============================================================
// FEATURE: CLEAR COMPLETED TODOS
// ============================================================
fixture`Feature: Clear completed`.page(URL);

test('clear completed removes done todos', async t => {
  await addTodo(t, 'Done task');
  await t.click('.toggle-btn').click('#clear-completed-btn');
  await t.expect(todoItems.count).eql(0);
});

test('clear completed keeps unfinished todos', async t => {
  await addTodo(t, 'Done task');
  await addTodo(t, 'Open task');
  await t.click(todoItems.withText('Done task').find('.toggle-btn'));
  await t.click('#clear-completed-btn');
  await t.expect(todoItems.count).eql(1);
  await t.expect(todoItems.innerText).contains('Open task');
});

// ============================================================
// FEATURE: PRIORITY LEVELS
// ============================================================
fixture`Feature: Priority levels`.page(URL);

test('the chosen priority is shown next to the todo', async t => {
  await addTodo(t, 'Urgent task', 'High');
  await t.expect(Selector('.priority').textContent).contains('High');
});

test('todos are sorted High, Medium, Low', async t => {
  await addTodo(t, 'Low task', 'Low');
  await addTodo(t, 'High task', 'High');
  await addTodo(t, 'Medium task', 'Medium');
  await t.expect(todoItems.nth(0).innerText).contains('High task');
  await t.expect(todoItems.nth(1).innerText).contains('Medium task');
  await t.expect(todoItems.nth(2).innerText).contains('Low task');
});

// ============================================================
// FEATURE: SEARCH
// ============================================================
fixture`Feature: Search`.page(URL);

test('typing in the search field filters the list', async t => {
  await addTodo(t, 'Buy milk');
  await addTodo(t, 'Clean room');
  await t.typeText('#search-input', 'milk');
  await t.expect(todoItems.count).eql(1);
  await t.expect(todoItems.innerText).contains('Buy milk');
});

test('clearing the search field shows all todos again', async t => {
  await addTodo(t, 'Buy milk');
  await addTodo(t, 'Clean room');
  await t.typeText('#search-input', 'milk');
  await t.selectText('#search-input').pressKey('delete');
  await t.expect(todoItems.count).eql(2);
});

// ============================================================
// FEATURE: LOCAL STORAGE
// ============================================================
fixture`Feature: Local storage`.page(URL);

test('todos are still there after a page refresh', async t => {
  await addTodo(t, 'Buy milk');
  await t.eval(() => location.reload());
  await t.expect(todoItems.count).eql(1);
  await t.expect(todoItems.innerText).contains('Buy milk');
});

test('completed status is kept after a page refresh', async t => {
  await addTodo(t, 'Buy milk');
  await t.click('.toggle-btn');
  await t.eval(() => location.reload());
  await t.expect(Selector('.todo-item .completed').exists).ok();
});

// ============================================================
// FEATURE: INPUT VALIDATION (ERROR HANDLING)
// ============================================================
fixture`Feature: Input validation`.page(URL);

test('an empty todo is not added', async t => {
  await t.click('.todo-form button[type="submit"]');
  await t.expect(todoItems.count).eql(0);
});

test('an empty submit shows the red error state', async t => {
  await t.click('.todo-form button[type="submit"]');
  await t.expect(Selector('#todo-input').hasClass('input-error')).ok();
  await t.expect(Selector('#error-message').visible).ok();
});
  