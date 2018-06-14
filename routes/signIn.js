const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/checkLogin').checkNotLogin

//GET /signIn 登录页
router.get('/', checkNotLogin, function(req, res, next) {
    res.send('登录页')
})

//POST /signIn 登录
router.post('/', checkNotLogin, function(req, res, next) {
    res.send('登录')
})

module.exports = router