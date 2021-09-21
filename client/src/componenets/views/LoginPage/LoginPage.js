import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom';



function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); //? 해당 코드 없이 로그인 버튼을 누르면 페이지가 새로고침 되어버림

        let body = { email: Email, password: Password }

        dispatch(loginUser(body)) // dispatch의 인자는 loginUser라는 변수의 action
            .then((res) => {
                if (res.payload.loginSuccess) {
                    props.history.push('/')
                }
                else {
                    alert('Error')
                }
            })

    }





    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type='email' value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type='password' value={Password} onChange={onPasswordHandler} />
                <br />
                <button>
                    Login
                </button>
            </form>
        </ div>
    )
}

export default withRouter(LoginPage)




//! es7 extension 설치 후, rfce 만 입력하면 디폴트 세팅 값이 나온다