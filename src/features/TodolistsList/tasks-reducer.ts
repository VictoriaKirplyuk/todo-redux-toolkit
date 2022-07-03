import {addTodolistAC, fetchTodolistsTC, removeTodolistAC} from './todolists-reducer'
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    TodolistType,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks',
    (todolistId: string, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        return todolistsAPI.getTasks(todolistId)
            .then((res) => {
                const tasks = res.data.items
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return {tasks, todolistId}
            })
    })

export const removeTaskTC = createAsyncThunk('tasks/removeTask',
    (param: { taskId: string, todolistId: string }) => {

        return todolistsAPI.deleteTask(param.todolistId, param.taskId)
            .then(() => ({taskId: param.taskId, todolistId: param.todolistId}))
    })

export const addTaskTC = createAsyncThunk('tasks/addTask',
    (param: { title: string, todolistId: string }, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        return todolistsAPI.createTask(param.todolistId, param.title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const task = res.data.data.item
                    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {task}
                } else {
                    handleServerAppError(res.data, thunkAPI.dispatch)
                }
            })
            .catch(error => {
                handleServerNetworkError(error, thunkAPI.dispatch)
            })
    })


const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        updateTaskAC: (state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) => {
            state[action.payload.todolistId] = state[action.payload.todolistId].map(t => t.id === action.payload.taskId
                ? {...t, ...action.payload.model}
                : t)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            action.payload?.todolists && action.payload.todolists.forEach((tl: TodolistType) => {
                state[tl.id] = []
            })
        })
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = state[action.payload.todolistId].filter(t => t.id != action.payload.taskId)
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            action.payload?.task && state[action.payload.task.todoListId].unshift(action.payload.task)
        })
    }
})

export const tasksReducer = slice.reducer

// actions
export const {
    updateTaskAC
} = slice.actions

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {

            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTaskAC({taskId: taskId, model: domainModel, todolistId: todolistId})
                    dispatch(action)
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

