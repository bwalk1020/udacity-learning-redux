import generate from "@babel/generator";
import * as Redux from 'redux';

// App Code
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';
const TOGGLE_GOAL = 'TOGGLE_GOAL';
const BAD_IDEA = 'Nope. That\'s a bad idea!';

function addTodoAction (todo) {
  return {
    type: ADD_TODO,
    todo
  }
}

function removeTodoAction (id) {
  return {
    type: REMOVE_TODO,
    id
  }
}

function toggleTodoAction (id) {
  return {
    type: TOGGLE_TODO,
    id
  }
}

function addGoalAction (goal) {
  return {
    type: ADD_GOAL,
    goal
  }
}

function removeGoalAction (id) {
  return {
    type: REMOVE_GOAL,
    id
  }
}

function toggleGoalAction (id) {
  return {
    type: TOGGLE_GOAL,
    id
  }
}

function todos (state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map(todo => todo.id !== action.id ? todo : Object.assign({}, todo, {complete: !todo.complete}));
    default:
      return state;
  }
}

function goals (state = [], action) {
  switch(action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id);
    case TOGGLE_GOAL:
      return state.map(goal => goal.id !== action.id ? goal : Object.assign({}, goal, {complete: !goal.complete}));
    default:
      return state;
  }
}

const checker = (store) => (next) => (action) => {
  if((action.type === ADD_TODO && action.todo.name.toLowerCase().includes('bitcoin'))) {
    return alert(BAD_IDEA);
  } else if (action.type === ADD_GOAL && action.goal.name.toLowerCase().includes('bitcoin')) {
    return alert(BAD_IDEA)
  } else {
    next(action);
  }
}

const logger = (store) => (next) => (action) => {
  console.group(action.type);
    console.log('The action: ', action);
    const result = next(action);
    console.log('The new state: ', store.getState());
  console.groupEnd();
  return result;
}

const store = Redux.createStore(Redux.combineReducers({
    todos,
    goals,
  }
), Redux.applyMiddleware(checker, logger));

store.subscribe(() => {
  const {goals, todos} = store.getState();

  document.getElementById('todos').innerHTML = '';
  document.getElementById('goals').innerHTML = '';
  goals.forEach(addGoalToDOM);
  todos.forEach(addTodoToDOM);
});

function generateId () {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

// DOM Code
function addTodo (event) {
  event.preventDefault();
  const input = document.getElementById('todo');
  const name = input.value;
  input.nodeValue = '';

  if (name) {
    const todo = {
      name,
      complete: false,
      id: generateId()
    };
    store.dispatch( addTodoAction(todo));
  }
}

function addGoal (event) {
  event.preventDefault();
  const input = document.getElementById('goal');
  const name = input.value;

  input.nodeValue = '';
  if (name) {
    const goal = {
      name,
      complete: false,
      id: generateId()
    };
    store.dispatch( addGoalAction(goal));
  }
}

function addTodoToDOM (todo) {
  const node = document.createElement('li');
  const text = document.createTextNode(todo.name);
  const removeButton = createRemoveButton(() =>{
    store.dispatch( removeTodoAction(todo.id));
  });

  node.appendChild(text);
  node.appendChild(removeButton);
  node.style.textDecoration = todo.complete ? 'line-through' : 'none';
  node.addEventListener('click', () =>{ 
    store.dispatch( toggleTodoAction(todo.id));
  });
  document.getElementById('todos')
    .appendChild(node);
}

function createRemoveButton (onClick) {
  const removeButton = document.createElement('button');
  removeButton.innerHTML = 'X';
  removeButton.addEventListener('click', onClick);
  return removeButton;
}

function addGoalToDOM (goal) {
  const node = document.createElement('li');
  const text = document.createTextNode(goal.name);
  const removeButton = createRemoveButton(() =>{
    store.dispatch( removeGoalAction(goal.id));
  });

  node.appendChild(text);
  node.appendChild(removeButton);
  node.style.textDecoration = goal.complete ? 'line-through' : 'none';
  node.addEventListener('click', () =>{ 
    store.dispatch( toggleGoalAction(goal.id));
  });
  document.getElementById('goals')
    .appendChild(node);
}

document.getElementById('todo-btn')
  .addEventListener('click', addTodo);

document.getElementById('goal-btn')
  .addEventListener('click', addGoal);

