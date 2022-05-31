import {Dispatch} from 'redux'
import {authAPI} from '../api/todolists-api'
import {setIsLoggedInAC} from '../features/Login/auth-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'idle',  // происходит ли сейчас взаимодействие с сервером
    error: null,  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    isInitialized: false  // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
}

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        //этот редьюсер(()=>{}) создаст экшен(на основе его логики), который запустит setAppStatusAC
        setAppStatusAC: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status  //без return можно
        },
        setAppErrorAC:(state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        setAppInitializedAC: (state, action: PayloadAction<{value: boolean}>) => {
            state.isInitialized = action.payload.value
        }
    }
})

export const appReducer = slice.reducer
export const { setAppStatusAC, setAppErrorAC, setAppInitializedAC  } = slice.actions

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
        }
        dispatch(setAppInitializedAC({value: true}));
    })
}


