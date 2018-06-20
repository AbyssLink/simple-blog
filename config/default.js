module.exports = {
    port: 3000,
    session: {
        secret: 'SimpleBlog',
        key: 'SimpleBlog',
        resave: true, //当客户端并行发送多个请求时， 其中一个请求在另一个请求结束时对session进行修改覆盖并保存。
        saveUninitialized: true, //初始化session时是否保存到存储。 默认为true， 但是(后续版本) 有可能默认失效， 所以最好手动添加。
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/SimpleBlog'
}