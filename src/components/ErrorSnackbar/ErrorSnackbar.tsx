import React, {ReactElement, SyntheticEvent, useState} from 'react'
import {setAppErrorAC} from '../../app/app-reducer'
import {Alert, AlertProps, Snackbar} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";

const MyAlert = (props: AlertProps): ReactElement => {
    return <Alert elevation={6} variant="filled" {...props} />
}

export const ErrorSnackbar = (): ReactElement => {
    const [open, setOpen] = useState(true);
    const error = useAppSelector(state => state.app.error);
    const dispatch = useAppDispatch();

    const handleClose = (event?: Event | SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        dispatch(setAppErrorAC({error: null}));
    }

    const isOpen = error !== null;

    return (
        <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
            <MyAlert onClose={handleClose} severity="error">
                {error}
            </MyAlert>
        </Snackbar>
    )
}
