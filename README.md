# SimpleBlog：基于 Express 与 Mongodb 的简易多人 blog 实现

## 项目参考：

N-blog: https://github.com/nswbmw/N-blog

感谢作者大大详尽的指导，后端基本用的作者原始的架构

关于 fetchAPI,  express 的原理没有深入了解，总体做了点搬砖的活



## 项目地址：

SimpleBlog: https://github.com/Ubilabs-NicholasCheng/SimpleBlog

该项目已布在公网服务器上，demo地址：http://120.78.134.26

### 页面演示：

- **主页：**

![Snipaste_2018-06-27_02-12-15](E:\OneDrive - business\ZUCC课程\JS-BigWork\asserts\Snipaste_2018-06-27_02-12-15.png)

  

- **特定文章页：**

![Snipaste_2018-06-27_02-12-47](E:\OneDrive - business\ZUCC课程\JS-BigWork\asserts\Snipaste_2018-06-27_02-12-47.png)



- **发布文章页：**

![Snipaste_2018-06-27_02-13-17](E:\OneDrive - business\ZUCC课程\JS-BigWork\asserts\Snipaste_2018-06-27_02-13-17.png)




- **电影页：**

![Snipaste_2018-06-27_02-13-34](E:\OneDrive - business\ZUCC课程\JS-BigWork\asserts\Snipaste_2018-06-27_02-13-34.png)




## 使用方法：

环境配置：预装 MongoDB， Node.js

```shell
mkdir mongodb/data
mongod --dbpath=mongodb/data
git clone https://github.com/Ubilabs-NicholasCheng/SimpleBlog.git
cd SimpleBlog
npm i
vim config/default.js #修改端口 80->3000
node index.js
```

之后，访问 localhost:3000



## 项目目录结构：

1. `lib`: 定义实体的数据结构

2. `models`: 操作数据库的文件

3. `public`: 静态文件，如样式、图片，包括用户上传的头像等

4. `routes`: 存放路由文件

5. `views`: 用于渲染的视图文件

6. `index.js`: 程序主文件

7. `package.json`: 项目名、描述、作者、依赖等等信息

8. `config`: 项目的配置信息，服务器端口，连接的数据库端口等

   遵循 MVC 的开发模式

   

## 前端组件库

1. `Materilazie + GoogleIcons`: Material Design 风格的组件库与 Google 图标
2. `github-markdown-css`: 添加 github markdown 风格样式
3. `highlight.js`: 代码语法高亮
4. `simpleMDE`:  markdown 的样式支持
5. `jquery`: 实现动画等功能
6. `materialize.min.js` : materialize 组件的js库



## 后端依赖模块

1. `express`: web 框架
2. `express-session`: session 中间件
3. `connect-mongo`: 将 session 存储于 mongodb，结合 express-session 使用
4. `connect-flash`: 页面通知的中间件，基于 session 实现
5. `ejs`: 模板
6. `express-formidable`: 接收表单及文件上传的中间件
7. `config-lite`: 读取配置文件
8. `marked`: markdown 解析
9. `moment`: 时间格式化
10. `mongolass`: mongodb 驱动
11. `objectid-to-timestamp`: 根据 ObjectId 生成时间戳
12. `sha1`: sha1 加密，用于密码加密
13. `winston`: 日志
14. `express-winston`: express 的 winston 日志中间件



## 主要功能

1. 多用户注册登录
2. 发表、修改、删除文章
3. 发表、删除评论
4. 添加视频



## 实现方法

1. 服务器后端框架：express，使用express 控制路由，动态渲染特定界面
2. 数据库驱动：Mongolass，服务器与数据库交互的中间件
3. 模板引擎：ejs，动态渲染前端页面



### **以登陆后的用户创建 movies 为实例：**


定义 Movie 的 schema：

```javascript
// lib/mongo.js
const Mongolass = require('mongolass')
const mongolass = new Mongolass()

/********* Movie Schema **********/
exports.Movie = mongolass.model('Movie', {
    title:{
        type: 'string',
        required: true
    },
    src:{
        type: 'string',
        required: true
    }
})

// 建立索引
exports.Movie.index({
        postId:1,
        _id: 1
    }).exec()
```



Movie 这个 model 中定义的方法，加载所有电影，删除与获取特定的电影：

(Mongolass 这个驱动的方法与mongodb的数据库api一致，使用起来很直观)

```javascript
// model/movies.js
const Movies = require('../lib/mongo').Movie

module.exports = {
    create: function create (movie) {
        return Movies.create(movie).exec()
    },

    // 通过电影 id 获取一部电影
    getMovieById: function getMovieById(movieId) {
        return Movies.findOne({
            _id: movieId
        }).exec()
    },

    // 通过电影 id 删除一部电影
    delMovieById: function (movieId) {
        return Movies.deleteOne({
            _id: movieId
        }).exec()
    },

    //找到所有的电影
    getMovies: function () {
        return Movies.find({
        }).exec()
    }
}
```



定义表单的方法为 post，input 的 name 为属性名。

```ejs
// views/createMovies.ejs
<form class="col s12 m12 " method="POST">
      // more code here 
      <input name="title" id="title" type="text" class="validate">
      <input name="src" id="src" type="text" class="validate" >
      // more code here 
</form>
```



express 的路由中提供了处理请求的方法，input 的 value 将挂载在 req.fileds.name 这一属性下：

使用 MovieModel 的 create方法，在数据库对应的表中插入这一条用户新创建的数据，若该表不存在则会创建该表。

```javascript
// routes/movies.js
// 创建电影页
router.post('/create', function(req, res, next) {

    const movieId = req.fields.movieId
    const title = req.fields.title
    const src = req.fields.src

    // 校验参数
    try {
        if (!src.length) {
            throw new Error('Please write movie src!')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    const movie = {
        movieId: movieId,
        title: title,
        src: src
    }

    MovieModel.create(movie)
        .then(function() {
            req.flash('success', 'create movie successfully!')
            // 创建成功后跳转到上一页
            res.redirect('/movies')
        })
        .catch(next)

})
```


同时引入了 checkLogin 方法，判断用户是否登陆，登陆后的用户才有权限创建电影：

```javascript
// middlewares/checkLogin.js
module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            //设置当前的错误为未登录
            req.flash('error', '未登录')
            return res.redirect('/signIn')
        }
        next()
    },
    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录')
            return res.redirect('back') //若已登录返回原页面
        }
        next()
    }
}
```



使用 MovieModel 中定义的 getMovies() 方法，查询到 movies 表下的所有记录，使用res.render() 方法渲染ejs模板，并传入这些查询到的记录。

```javascript
// routes/movies.js
// 显示电影页
router.get('/', function(req, res, next) {
    MovieModel.getMovies()
        .then(function (movies) {
            res.render('movies', {
                movies: movies
            })
        })
        .catch(next)
})
```



前端的 ejs 模板获取到服务器响应传入的多条记录，使用 forEach方法将其依次渲染：

(components/movies-content.ejs 作为组件，movies.ejs 使用include方法渲染多个 movies-content.ejs组件 )

```ejs
//  views/components/movies-content.ejs 
<label><h5 class="white-text center-align" style="margin-top: 230px;">
      <%= movie.title %></h5></label>
   <div class="responsive-video center-align"  controls>
      <iframe width="853" height="480" src="<%= movie.src %>" frameborder="0" allowfullscreen>		</iframe>
   </div>
```

```ejs
// views/movies.ejs
<%- include('header') %>
    <% movies.forEach(function (movie) { %>
        <%- include('components/movie-content', { movie: movie }) %>
    <% }) %>
<%- include('footer') %>
```

这样，就完成了一个简单的 用户提交表单 -> 服务端存储数据到数据库 -> 服务端重渲染视图 的前后端交互流程 。



项目的设计还涉及到用户密码的hash加密，时间日期的格式化，日志的保存等，配置文件的更改及代码风格等，但简单的流程就如上所示。



## TO DO

- 增加用户文章的分类与标签功能
- 增加文章的分页显示功能
- 增加用户的文章收藏功能
- 增加电影的分类与标签功能
- 增加用户的电影收藏功能
