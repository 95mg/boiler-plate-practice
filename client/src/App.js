import './App.css';
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LandingPage from './componenets/views/LandingPage/LandingPage';
import LoginPage from './componenets/views/LoginPage/LoginPage';
import RegisterPage from './componenets/views/RegisterPage/RegisterPage';
import Auth from './HigherOrderComponent/auth'


function App() {
  return (
    <Router>
      <div>

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          {/* option 기본값으로 
          null(=> allow all user), 
          true(=> allow logined user), 
          false(=> NOT allow logined user)*/}
          <Route exact path="/" component={Auth(LandingPage, null)} />
          < Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
        </Switch>
      </div>
    </Router >
  );
}

export default App;

/*
 이미 npm create-react-app을 -g로 설치했다면
 npm init react-app *projectFolderName* 을 실행해야 한다
*/



// 해당 페이지 작성을 위해서 npm react-router-dom --save 설치
// 해당 페이지의 뼈대는 google에 react router dom를 검색하면 나오는 페이지에서 그대로 가져올 수 있음



