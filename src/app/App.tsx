import React, {useCallback, useEffect} from 'react'
import './App.css'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {useSelector} from 'react-redux'
import {RootState} from './store'
import {initializeAppTC, RequestStatusType} from './app-reducer'
import AppRouter from "../router/AppRouter"
import {AppBar, Button, Container, LinearProgress, Toolbar, Typography} from '@mui/material'
import {useAppDispatch} from "../hooks/redux-hooks";
import {logoutTC} from "../features/Login/auth-reducer";

function App() {
    const status = useSelector<RootState, RequestStatusType>((state) => state.app.status)
    const isInitialized = useSelector<RootState, boolean>((state) => state.app.isInitialized)
    const isLoggedIn = useSelector<RootState, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logoutHandler = useCallback(() => {
        dispatch(logoutTC())
    }, [dispatch])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            {/*<CircularProgress/>*/}
        </div>
    }

    return (
        <div className="app">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        To Do
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container>
                <AppRouter/>
            </Container>
        </div>
    )
}

export default App
