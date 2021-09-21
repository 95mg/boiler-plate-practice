import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux'; //!
import { applyMiddleware, createStore } from 'redux'; //!
import promiseMiddleware from 'redux-promise' //!
import ReduxThunk from 'redux-thunk' //!
import Reducer from './_reducers';


// 위의 ! 표시가 있는 것들이 모두 redux를 위해 import해온 설정값들
// 아래의 한 줄이, plain object만 받는 게 아니라
// promise, function까지 받을 수 있는 store를 만들어내는 코드
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)

ReactDOM.render(
  <Provider
    store={createStoreWithMiddleware(Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && //! chrom extension Redux DevTool을 사용하기 위함
      window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <App />
  </Provider >,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
