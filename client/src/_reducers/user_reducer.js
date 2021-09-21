
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from '../_actions/types'

export default function (state = {}, action) {

    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload }
            break;
        case AUTH_USER:
            return { ...state, userData: action.payload } //? server단에서의 처리에 의해 user의 모든 데이터가 들어옴
        default:
            return state;
    }


}