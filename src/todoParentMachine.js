import { assign, createMachine, spawn } from "xstate";
import { createTodoMachine } from "./todoMachine";

export const todoParentMachine = createMachine({
    initial: 'idle',
    context: {
        todos: [],
        todoValue: "",
        filter: "All" // all , completed, active
    },
    states: {
        idle: {
            on: {
                "NEWTODO.UPDATE": {
                    actions: ['updateTodoValue']
                },
                "NEWTODO.COMMIT": {
                    actions: ['commitTodoValue', 'clearTodoValue']
                },
                "SET_FILTER": {
                    actions: ['setFilter']
                },
                "UPDATE_STATUS": {
                    actions: ['updateTodoStatus']
                },
                "DELETE_TODO": {
                    actions: ['deleteTodo']
                }
            }
        }
    }
},{
    actions: {
        updateTodoValue: assign({
            todoValue: (_, event) => event.data.value
        }),
        commitTodoValue: assign({
            todos: (context) => {
                const {todos, todoValue} = context;
                const id = crypto.randomUUID()
                return [...todos, {
                    status: "active",
                    id,
                    actorRef: spawn(createTodoMachine({value: todoValue, id:id, status: "active" }))
                }]
            }
        }),
        clearTodoValue: assign({
            todoValue: ""
        }),
        setFilter: assign({
            filter: (_, event) => event.data.filter
        }),
        updateTodoStatus: assign({
            todos: (context, event) => {
                const {todos} = context;
                return todos.map(todo => {
                    if(todo.id === event.data.id){
                        todo.status = event.data.status
                    }
                    return todo;
                })
            }
        }),
        deleteTodo: assign({
            todos: (context, event) => {
                const deletedTodo = context.todos.find(todo => todo.id === event.data.id);
                deletedTodo.actorRef.stop()
                return context.todos.filter(todo => todo.id !== event.data.id )
            }
        }),

    }
})