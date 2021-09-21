import axios from 'axios';
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types';

export function loginUser(dataToSubmit) { //? dataToSubmit 는 body 부분에 해당하기 때문에 post에서는 필요

    const request = axios.post('/api/users/login', dataToSubmit)
        .then(res => res.data)

    return {
        type: LOGIN_USER,
        payload: request
    }
}


export function registerUser(dataToSubmit) {

    const request = axios.post('/api/users/register', dataToSubmit)
        .then(res => res.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}


export function auth() { //? dataToSubmit 는 body 부분에 해당하기 때문에 get에서는 필요 X

    const request = axios.get('/api/users/auth',)
        .then(res => res.data)

    return {
        type: AUTH_USER,
        payload: request
    }
}