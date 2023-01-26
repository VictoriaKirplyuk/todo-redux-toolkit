import React from 'react'
import {Route, Routes} from "react-router-dom";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {Login} from "../features/Login/Login";

const AppRouter = () => {
    return (
        <Routes>
            <Route path={'/'} element={<TodolistsList/>}/>
            <Route path={'/login'} element={<Login/>}/>
        </Routes>
    )
}

export default AppRouter;