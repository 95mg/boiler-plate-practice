const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { User } = require('./models/User');
// const bodyParser = require('body-parser')
const config = require('../server/config/key');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
//? bodyParser가 express generator에 내장되어 있어 따로 설치하지 않아도 사용 가능
// 참조(https://bit.ly/391uv2t)

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());




/*
* mongoose.connect에 연결하는 건 'Connect your application' 옵션
하단의 옵션들은 에러가 나지 않기 위해 설정한다
단, useCreateIndex: true, useFindAndModify: false 옵션들에 대해서는 지원 중지
(참고: https://bit.ly/2XeZcOV)
*/
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        console.log('monogDB connect Success')
    })
    .catch((e) => { console.log(e) })


app.get('api/hello', (req, res) => res.send('Hello, this is Boiler Plate For Project!'))

app.post('/api/users/register', (req, res) => {
    // 회원가입에 필요한 정보를 client에서 가져오면
    // 해당 정보를 DB에 넣어준다

    const user = new User(req.body);
    // models.js의 userSchema.pre가 실행되는 자리 
    user.save((err, userinfo) => {
        if (err) {
            console.log("**************", err)
            return res.json({ success: false, err })
        }
        else {
            return res.status(200).json({
                success: true
            })
        }

    })
    //* 아래의 경우도 가능
    // user.save()
    //     .then(() => {
    //         res.status(200).json({ success: true })
    //     })
    //     .catch((e) => {
    //         res.status(400).json({ success: false, e })
    //     })
    // user.save 사용법 참조(https://bit.ly/3k15k6t)
})

app.post('/api/users/login', async (req, res) => {
    // 1. 사용자 email이 DB에 있는지 확인
    // 2. 요청한 email이 있다면, 비밀번호가 일치하는지 확인
    // 3. 해당 사용자를 위한 토큰 생성해 발급하기
    await User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({ loginSuccess: false, message: "입력된 이메일과 일치하는 값이 없습니다" })
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            // console.log(req.body.password)
            if (!isMatch) {
                res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            }
            else {
                user.generateToken((err, user) => {
                    if (err) {
                        res.status(400).send(err);
                    }
                    else {
                        // 토큰 저장 : cookie, localstorage 등등
                        res.cookie("x_auth", user.token)
                            .status(200)
                            .json({ loginSuccess: true, userId: user._id })
                    }
                })
            }
        })

    })


})



app.get('/api/users/auth', auth, (req, res) => {
    console.log("______________________________", req.user)
    // 함수가 실행된다는 것은 미들웨어까지 성공적으로 통과했음을 의미
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? fale : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })

})


/*
바로 아랫줄의 auth는 auth.js에서 가져온 함수
아래의 User.findOneAndUpdate => findOneAndUpdate(query, update, options)
 */
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) {
            res.json({ success: false })
        }
        else {
            res.status(200).send({ success: true })
        }
    })

})

app.get('/api/hello', (req, res) => {
    res.send("안녕하세요~")
})

var port = 5000;
app.listen(port, () => console.log(`example app listening on port ${port}`))