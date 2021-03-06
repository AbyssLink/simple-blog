const express = require('express')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')
const winston = require('winston') //实现日志功能
const expressWinston = require('express-winston') //实现日志功能


const app = express()

//设置视图目录
app.set('views', path.join(__dirname, 'views'))
    //设置模板引擎为ejs
app.set('view engine', 'ejs')

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

//设置 session 中间件
app.use(session({
    name: config.session.key, //设置cookie 中保存 session_id 的字段名称
    secret: config.session.secret, //设置 secret 来计算 hash 值放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge //过期时间，过期后 cookie 中的 session_id 会自动删除
    },
    store: new MongoStore({ //将session 存储到 mongodb 持久化数据
        url: config.mongodb //mongodb地址
    })
}))

//flash 中间件，用于显示通知
app.use(flash())

// 处理表单及文件上传的中间件
// 我们使用 express - formidable 处理 form 表单（ 包括文件上传）
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
    keepExtensions: true // 保留后缀
}))

// 设置模板全局常量
// 将 blog 博客常量信息挂载到 app.locals 上
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
}

// 添加模板必需的三个变量
// user, success, error 等变量信息挂载到 res.locals 上
// 这样我们在使用 res.render() 方法时就不用传入这些变量了
app.use(function(req, res, next) {
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
})

// 正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}))

//设置路由，将按照 ./routes 目录下的 index.js 进行路由
routes(app)

// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}))

/* 这里我们实现了将错误信息用页面通知展示的功能，
刷新页面将会跳转到主页并显示『 权限不足』 的红色通知。 */
app.use(function(err, req, res, next) {
    console.error(err)
    req.flash('error', err.message)
    res.redirect('/posts')
})

/* app.listen(config.port, function() {
    console.log(`${pkg.name} listening on port ${config.port}`)
}) */

// 这样做可以实现： 直接启动 index.js 则会监听端口启动程序， 
// 如果 index.js 被 require 了， 则导出 app， 通常用于测试。
if (module.parent) {
    // 被 require，则导出 app
    module.exports = app
} else {
    // 监听端口，启动程序
    app.listen(config.port, function() {
        console.log(`${pkg.name} listening on port ${config.port}`)
    })
}