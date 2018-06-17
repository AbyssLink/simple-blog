const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

//获取用户模型
const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/checkLogin').checkNotLogin

//GET /signIn 登录页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signIn')
})

//POST /signIn 登录
router.post('/', checkNotLogin, function(req, res, next) {
    const name = req.fields.name
    const password = req.fields.password

    // 校验参数
    try {
        if (!name.length) {
            throw new Error('Please Enter UserName!')
        }
        if (!password.length) {
            throw new Error('Please Enter UserPassword!')
        }
    } catch (e) {
        req.flash('error', e.message)
            //重定向到原页面
        return res.redirect('back')
    }

    UserModel.getUserByName(name)
        .then(function(user) {
            if (!user) {
                req.flash('error', 'No such user!')
                return res.redirect('back')
            }
            // 检查密码是否匹配
            if (sha1(password) !== user.password) {
                req.flash('error', 'Password is wrong!')
                return res.redirect('back')
            }
            req.flash('success', 'Login success!')
                // 用户信息写入 session
            delete user.password
            req.session.user = user
                // 跳转到主页
            res.redirect('/posts')
        })
        .catch(next)
})

module.exports = router