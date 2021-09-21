import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action'



// Auth HOC(함수)에서는 다음 3가지 인자를 받아옵니다.
// SpecificComponent = HOC로 감싸고자 하는 특정 컴포넌트
//* option 설정값: null(=> allow all user), true(=> allow logined user), false(=> NOT allow logined user)
// adminRoute: null이 이미 기본값으로 설정 돼 있기 때문에 app.js에서 입력은 옵션처럼 가능
export default function (SpecificComponent, option, adminRoute = null) {

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth())
                .then((res) => {
                    // 로그인 하지 않은 상태
                    if (!res.payload.isAuth) {
                        if (option) {
                            props.history.push('/login');
                        }
                    }
                    // 로그인 한 상태
                    else {
                        if (adminRoute && !res.payload.isAdmin) { // 관리자가 아닌데 관리자 페이지로 가려고 할 때
                            props.history.push('/')
                        }
                        else {
                            if (!option) { // 로그인 했기 때문에 굳이 갈 필요가 없는 페이지 일 때
                                props.history.push('/')
                            }
                        }

                    }
                })
        }, [])

        return <SpecificComponent />
    }

    return AuthenticationCheck
}