import { assign, createMachine } from "xstate";
import { sendParent } from "xstate/lib/actions";

export const createTodoMachine = ({status, id, value}) => createMachine({
    initial: 'idle',
    context: {
        status,
        id,
        value
    },
    states: {
        idle: {
            on: {
                "TOGGLE_STATUS":{
                    actions: ['toggleStatus', "updateParentAboutStatus"]
                },
                "DELETE": {
                    actions: ['updateParentAboutYourDeletion']
                }
            }
        }
    }
},{
    actions: {
        toggleStatus: assign({
            status: context => context.status === 'completed' ? 'active' : 'completed'
        }),
        updateParentAboutStatus: sendParent(context => ({
            type: "UPDATE_STATUS",
            data: {
                id: context.id,
                status: context.status
            }
        })),
        updateParentAboutYourDeletion: sendParent(context => ({
            type: 'DELETE_TODO',
            data: {
                id: context.id
            }
        }))
    }
})