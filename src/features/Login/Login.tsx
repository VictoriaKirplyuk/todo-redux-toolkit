import React from 'react'
import {useFormik} from 'formik'
import {useSelector} from 'react-redux'
import {loginTC} from './auth-reducer'
import {RootState} from '../../app/store'
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Paper, TextField} from "@mui/material";
import './Login.css';
import {Navigate} from "react-router-dom";
import {useAppDispatch} from "../../hooks/redux-hooks";


interface ILoginSchema {
    email: string,
    password: string,
    rememberMe: boolean
}

export const Login = () => {
    const dispatch = useAppDispatch()

    const isLoggedIn = useSelector<RootState, boolean>(state => state.auth.isLoggedIn);

    const {values, errors, touched, handleSubmit, isValid, getFieldProps} = useFormik({
        validate: (values) => {
            const errors = {} as ILoginSchema;

            if (!values.email) {
                errors.email = 'email is required *';
            }
            if (!values.password) {
                errors.password = 'password is required *'
            }

            return errors;
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: values => {
            dispatch(loginTC(values));
        },
    })

    if (isLoggedIn) {
        return <Navigate to={"/"}/>
    }

    return <Grid container justifyContent="center" sx={{ mt: '8rem' }}>
        <Paper elevation={2} sx={{
            p: '2rem'
        }}>
            <Grid item xs={12}>
                <form onSubmit={handleSubmit}>
                    <FormControl>
                        <FormLabel sx={{
                            p: '1rem 0',
                        }}>
                            <div className="formHeader">
                                <p>
                                    To log in get registered
                                    <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>here</a>
                                </p>
                                <p>or use common test account credentials:</p>
                            </div>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField
                                variant="standard"
                                label={errors.email && touched.email ? errors.email : 'email'}
                                error={!!errors.email && !!touched.email}
                                margin="normal"
                                {...getFieldProps("email")}
                            />
                            <TextField
                                type="password"
                                variant="standard"
                                label={errors.password && touched.password ? errors.password : 'password'}
                                error={!!errors.password && !!touched.password}
                                margin="normal"
                                {...getFieldProps("password")}
                            />
                            <FormControlLabel
                                label={'Remember me'}
                                control={
                                    <Checkbox
                                        {...getFieldProps("rememberMe")}
                                        checked={values.rememberMe}
                                    />
                                }
                            />
                            <Button type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={!isValid}
                                    sx={{
                                        mt: '1rem'
                                    }}
                            >
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Paper>
    </Grid>
}
