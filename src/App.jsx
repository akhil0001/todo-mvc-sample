import { useMachine } from '@xstate/react'
import './App.css'
import { todoParentMachine } from './todoParentMachine'
import { useCallback, useMemo } from 'react';
import { TodoView } from './components/TodoView';

function App() {
  const [state, send]= useMachine(todoParentMachine);

  const {todoValue, todos, filter} = state.context;

  const onChangeCb = useCallback((e) => {
    const currentValue = e.currentTarget.value;
    send({
      type: "NEWTODO.UPDATE",
      data: {
        value: currentValue
      }
    })
  },[send])

  const onEnter = useCallback((e) => {
    if(e.key === "Enter"){
      send({
        type: 'NEWTODO.COMMIT'
      })
    }
  },[send])

  const onSetFilterCb = useCallback((type) => {
    send({
      type: 'SET_FILTER',
      data: {
        filter: type
      }
    })
  },[send])

  const displayTodos = useMemo(() => {
    if(filter === "All"){
      return todos;
    }
    else if(filter === "Active"){
      return todos.filter(todo => todo.status === 'active');
    }
    else if(filter === "Completed"){
      return todos.filter(todo => todo.status === "completed")
    }
  },[todos, filter])

  const leftItemsLength = useMemo(() => {
    return todos.filter(todo => todo.status === "active").length;
  },[todos])

  return (
    <>
      <input placeholder='What needs to be done?' className="todo-input" type="text" value={todoValue} onChange={onChangeCb} onKeyDown={onEnter}   />
      {todos.length !== 0 && (
        <ul>
          {displayTodos.map(todo => <TodoView key={todo.id} actorRef={todo.actorRef} />)}
        </ul>
      )}
      <button onClick={() => onSetFilterCb('All')}>All</button>
      <button onClick={() => onSetFilterCb("Active")}>Active</button>
      <button onClick={() => onSetFilterCb("Completed")}>Completed</button>
      <p>Filter: {filter}</p>
      {leftItemsLength !== 0 && <p>{leftItemsLength} Items Left</p>}
    </>
  )
}

export default App
