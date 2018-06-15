const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

// 我们定义了用户表的 schema，生成并导出了 User 这个 model，
// 用户具有名，邮箱，密码，头像，性别，简历 六个属性
exports.User = mongolass.model('User', {
    name: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    avatar: {
        type: 'string',
        required: true
    },
    gender: {
        type: 'string',
        enum: ['male', 'female', 'secret'],
        default: 'secret'
    },
    bio: {
        type: 'string',
        required: true
    }
})

// 同时设置了 name 的唯一索引，保证用户名是不重复的。
exports.User.index({
        name: 1
    }, {
        unique: true
    }).exec() // 根据用户名找到用户，用户名全局唯一