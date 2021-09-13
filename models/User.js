const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //trim === spacebar에 반응하여 활성화(true => spacebar를 제거)
        unique: 1 //unique === email 입력값에 반응하여 활성화(1) => 중복을 방지
    },
    password: {
        type: String,
        minlength: 5
    },
    lastName: {
        type: String,
        maxlength: 50
    },
    roll: { // 관리자, 일반 유저 등의 구분을 위해 부여하는 roll
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

const User = mongoose.model('User', userSchema)
// model은 schema를 감싸는 역할이고
// schema는 정보 하나하나에 대하여 설정
//* mongoose.model()스키마 를 호출하면 Mongoose 가 모델을 컴파일 합니다
//첫 번째 인수는 모델이 사용되는 컬렉션 의 단수 이름 
// Mongoose는 자동으로 모델 이름의 복수형 소문자 버전을 찾습니다
// (참조: https://mongoosejs.com/docs/models.html)

module.exports = { User }
// 객체 형태로 내보내기 위해서 {User} 형태로 사용