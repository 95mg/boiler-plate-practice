const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');


// mongoose.connect에 연결하는 건 'Connect yout application' 옵션
//  useCreateIndex: true, useFindAndModify: false 옵션들에 대해서는 참고(https://runebook.dev/ko/docs/mongoose/deprecations)
//* 에러 방지를 위한 설정 중 상단의 지원 중지 옵션들이 어떤 역할을 하는지 알아보기

mongoose.connect("mongodb+srv://hailey:saveroom82@cluster0.apchb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => {
    console.log('monogDB connect Success')
})
.catch((e)=> {console.log(e)})


app.get('/', (req,res) => res.send('안녕하세요. 프로젝트 보일러 플레이트 입니다!'))
app.listen(port, () => console.log(`example app listening on port ${port}`))