import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;


function LandingPage(props) {
    useEffect(() => {
        axios.get('/api/hello')
            .then((res) => {
                console.log(res.data)
            })
    }, [])

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then((res) => {
                if (res.data.success) {
                    props.history.push('/login')
                }
            })
            .catch((e) => { '로그아웃에 실패하였습니다' })
    }


    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h2>
                Landing here!
                <br />
                <button onClick={onClickHandler}>
                    logout here!
                </button>
            </h2>
        </div>
    )
}

export default LandingPage




//! es7 extension 설치 후, rfce 만 입력하면 디폴트 세팅 값이 나온다