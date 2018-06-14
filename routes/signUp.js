const express = require('express')
const router = express.Router()

const checkNotLogin = require('../middlewares/checkLogin.js').checkNotLogin

//GET /signUp 注册页
router.get('/', checkNotLogin, function(req, res, next) {
    res.send('注册页')
})

//POST /signUp 注册页
router.post('/', checkNotLogin, function(req, res, next) {
    res.send('注册')
})

module.exports = router