const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const { User } = require('./models/User');
const bodyParser = require('body-parser')
const config = require('../config/key')

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
//? bodyParser가 express generator에 내장되어 있어 따로 설치하지 않아도 사용 가능
// 참조(https://bit.ly/391uv2t)

app.use(express.urlencoded({ extended: true }))
app.use(express.json());




// mongoose.connect에 연결하는 건 'Connect yout application' 옵션
//  useCreateIndex: true, useFindAndModify: false 옵션들에 대해서는 참고(https://bit.ly/2XeZcOV)
//* 에러 방지를 위한 설정 중 상단의 지원 중지 옵션들이 어떤 역할을 하는지 알아보기

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        console.log('monogDB connect Success')
    })
    .catch((e) => { console.log(e) })


app.get('/', (req, res) => res.send('Hello, this is Boiler Plate For Project!'))

app.post('/register', async (req, res) => {
    // 회원가입에 필요한 정보를 client에서 가져오면
    // 해당 정보를 DB에 넣어준다

    const user = await new User(req.body);
    user.save((err, userinfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        })

    })
    //* 아래의 경우 가능
    // user.save()
    //     .then(() => {
    //         res.status(200).json({ success: true })
    //     })
    //     .catch((e) => {
    //         res.status(400).json({ success: false, e })
    //     })
    // user.save 사용법 참조(https://bit.ly/3k15k6t)
})

app.listen(port, () => console.log(`example app listening on port ${port}`))