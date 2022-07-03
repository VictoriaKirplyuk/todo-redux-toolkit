import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolist',
    (args, thunkAPI) => {

        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        return todolistsAPI.getTodolists()
            .then((res) => {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return {todolists: res.data}
            })
            .catch(error => {
                handleServerNetworkError(error, thunkAPI.dispatch);
            })
    })

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist',
    (todolistId: string, thunkAPI) => {

        //изменим глобальный статус приложения
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        //изменим статус конкретного тудулиста(для disabled)
        thunkAPI.dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
        todolistsAPI.deleteTodolist(todolistId)
            .then(() => {
                thunkAPI.dispatch(removeTodolistAC({id: todolistId}))
                //изменим глобальный статус приложения
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            })
    })

export const addTodolistTC = createAsyncThunk('todolists/addTodolist',
    (title: string, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    thunkAPI.dispatch(addTodolistAC({todolist: res.data.data.item}))
                    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    //dispatch(setAppErrorAC({error: res.data.messages}))
                    thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
                }
            })
    })

export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolist',
    (param: { id: string, title: string }, thunkAPI) => {
        todolistsAPI.updateTodolist(param.id, param.title)
            .then(() => {
                thunkAPI.dispatch(changeTodolistTitleAC({id: param.id, title: param.title}))
            })
    })

const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolistAC: (state, action: PayloadAction<{ id: string }>) => {
            return state.filter(tl => tl.id != action.payload.id)
        },
        addTodolistAC: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitleAC: (state, action: PayloadAction<{ id: string, title: string }>) => {
            return state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
        },
        changeTodolistFilterAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            return state.map(tl => tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl)
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            return state.map(tl => tl.id === action.payload.id ? {...tl, entityStatus: action.payload.status} : tl)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            if(action.payload?.todolists) {
                return action.payload.todolists.map(tl => ({
                    ...tl,
                    filter: 'all',
                    entityStatus: 'idle'
                }))
            }
        })
    }
})

export const todolistsReducer = slice.reducer

// actions
export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC
} = slice.actions

//types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
