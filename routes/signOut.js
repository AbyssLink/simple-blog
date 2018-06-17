const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/checkLogin').checkLogin

//GET /signOut 登出页
router.get('/', checkLogin, function(req, res, next) {
    // 清空 session 中用户信息
    req.session.user = null

    req.flash('success', 'sign out success!')
        // 登出成功后跳转到主页
    res.redirect('/posts')
})

module.exports = router