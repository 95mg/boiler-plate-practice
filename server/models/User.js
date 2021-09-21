const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //salt가 몇 글자인지 나타냄
const jwt = require('jsonwebtoken')

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

/*
! (참조 https://darrengwon.tistory.com/415)
아래 해결책은 무조건 var user = this 와 fucntion(선언형 함수) 사용만 가능
새로운 사용자 객체를 생성할 때 암호화를 진행하려는 부분에서 this로 받아왔기 때문에 
밑의 함수에서 arrow function이 이 this를 찾지 못함에 주의
*/
userSchema.pre('save', function (next) {
    /* 
     *pre => index.js의 user.save() 이전에 삽입 됩니다.
     * callback(next) => 이 구문의 모든 것이 실행 되고 나면 next index.js의 user.save()이 실행 될 것임을 의미합니다.
     * 일종의 middleware 개념으로, userSchema를 사용해야 User.js 파일에 만들어줍니다.
     1) 비밀번호를 암호화 시킵니다
     2) 비밀번호를 암호화 시키기 위해 saltRounds 필요(참조 https://www.npmjs.com/package/bcrypt)
     3) 현재 req.body로 들어온을 user의 값을 의미
    */
    var user = this
    /* console.log(user)
     {
      name: 'new',
      email: 'new@google.com',
      password: '12341234',
      roll: 0,
      _id: new ObjectId("6141597ff6fed5f42e8efacc")
     }
     console.log(userSchema) 를 찍으면 정말로 schema에 대한 것만 콘솔창에 보여진다
     */
    if (user.isModified('password')) {
        /*
        * 현재 작성되고 있는 메소드는 그 자체로 미들웨어의 역할이므로 어떤 상황에서든 next()가 시행되어야만 한다.
        isModified 함수는 해당 값을 db에 기록된 값과 비교. (참조 https://bit.ly/3AbUxvZ)
        그렇지 않은 경우 false =>  err : 기존에 존재하던 비밀번호가 아니므로,  next(err)되어 비밀번호를 DB에 저장하 
        변경된 경우(= 비밀번호 변경 시) true => hash(기존 비밀번호, salt) => next()
         */
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                next(err);
            }
            else {
                bcrypt.hash(user.password, salt, function (err, hash) { // hasy === 암호화 된 비밀번호를 의미
                    if (err) {
                        next(err);
                    }
                    else {
                        user.password = hash;
                        next()
                    }
                })
            }
        })

    }
    else {
        next()
    }
})


/*
* bycrpt를 활용해 만든 custom method
! methods는 데이터 인스턴스를 가리킨다. 그러므로 method를 호출한 객체가 method 내에서의 this
bcrypt.compare: plainPassword 를 암호화 한 다음에 암호화 된 비밀번호와 비교해야 한다 (복호화 불가능 하기 때문)
*/
userSchema.methods.comparePassword = function (plainPassword, cb) {
    var user = this
    bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
        console.log(plainPassword, user.password)
        if (err) {
            cb(err);
        }
        else {
            cb(null, isMatch)
        }
    })
}

//* jsonwebtoken을 활용해 만든 custom method
//! methods는 데이터 인스턴스를 가리킨다
//! 그러므로 method를 호출한 객체가 method 내에서의 this가 되고
userSchema.methods.generateToken = function (cb) {
    var user = this;
    var accessToken = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = accessToken;
    user.save(function (err, user) {
        if (err) {
            return cb(err)
        }
        else {
            cb(null, user);
        }
    })

}

/*
* jsonwebtoken을 활용해 만든 custom method
! statics는 모델 자체를 가리킨다. statics를 호출한 객체에 상관없이 this가 모델 자체가 된다.
! findByToken에서 statics인 이유는 findOne은 mongoose 모델에서 작동하는 함수이기 때문이다
(참조 https://www.inflearn.com/questions/30860)
*/
userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    // token Decode(복호화)
    jwt.verify(token, 'secretToken', (err, decode) => {
        // user의 아이디를 이용해 유저를 찾은 다음
        // 클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 확인
        user.findOne({ "_id": decode, "token": token }, (err, user) => {
            if (err) {
                cb(err);
            }
            else {
                cb(null, user);
            }
        })
    })
}








const User = mongoose.model('User', userSchema)
// model은 schema를 감싸는 역할이고
// schema는 정보 하나하나에 대하여 설정
//* mongoose.model()스키마를 호출하면 Mongoose가 모델을 컴파일 합니다
//첫 번째 인수는 모델이 사용되는 컬렉션의 단수 이름 
// Mongoose는 자동으로 모델 이름의 복수형 소문자 버전을 찾습니다
// (참조: https://mongoosejs.com/docs/models.html)

module.exports = { User }
// 객체 형태로 내보내기 위해서 {User} 형태로 사용