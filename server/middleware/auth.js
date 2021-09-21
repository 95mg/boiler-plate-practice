const { User } = require("../models/User");

/*
인증처리를 담당하는 로직으로 
1. client가 보낸 cookie에서 토큰을 가져온 뒤
2. 해당 token을 복호화 한 후, user를 찾는다
3. user가 있는지 없는지에 경우에 따라 응답을 달리 한다.
User.findByToken은 커스텀 메소드
 */
let auth = (req, res, next) => {
    let token = req.cookies.x_auth;
    User.findByToken(token, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ isAuth: false, error: true })
        }
        else if (user) {
            // index의 app.get('/auth')에서 미들웨어 다음에 사용될 수 있도록 미리 조치
            req.token = token;
            req.user = user;
            next();
        }
    })


}

module.exports = { auth };