//! 여러 state을 관리하기 위해 여러 reducer가 존재
//! 여러 reducer를 하나로 합쳐 root reducer로서 하나로 만들기 위함
import { combineReducers } from "redux";
import user from './user_reducer'
// import comment from './comment_reducer'




const rootReducer = combineReducers({
    user
})

export default rootReducer
