const User = require('../lib/mongo').User

module.exports = {
    // 注册一个用户 exec)??
    create: function create(user) {
        return User.create(user).exec()
    }
}