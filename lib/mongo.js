const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
    // 引入时间戳模块
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

mongolass.connect(config.mongodb)

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function(results) {
        results.forEach(function(item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
        })
        return results
    },
    afterFindOne: function(result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
        }
        return result
    }
})

/********* User Schema **********/
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


/********* Posts Schema ************/
// 我们只存储文章的作者 id、 标题、 正文和点击量这几个字段
exports.Post = mongolass.model('Post', {
    author: {
        type: Mongolass.Types.ObjectId,
        required: true
    },
    title: {
        type: 'string',
        required: true
    },
    content: {
        type: 'string',
        required: true
    },
    pv: {
        type: 'number',
        default: 0
    }
})

exports.Post.index({
        author: 1,
        _id: -1
    }).exec() // 按创建时间降序查看用户的文章列表


/********* Comments Schema **********/
// 我们只需要留言的作者 id、 留言内容和关联的文章 id 这几个字段
exports.Comment = mongolass.model('Comment', {
    author: {
        type: Mongolass.Types.ObjectId,
        required: true
    },
    content: {
        type: 'string',
        required: true
    },
    postId: {
        type: Mongolass.Types.ObjectId,
        required: true
    }
})
exports.Comment.index({
        postId: 1,
        _id: 1
    }).exec() // 通过文章 id 获取该文章下所有留言，按留言创建时间升序

/********* Movie Schema **********/
exports.Movie = mongolass.model('Movie', {
    author:{
      type: Mongolass.Types.ObjectId,
      required: true
    },
    title:{
        type: 'string',
        required: true
    },
    src:{
        type: 'string',
        required: true
    }
})

exports.Movie.index({
        postId:1,
        _id: 1
    }).exec()