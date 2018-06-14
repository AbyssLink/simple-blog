const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/checkLogin').checkLogin

//GET /signOut 登出页
router.get('/', checkLogin, function(req, res, next) {
    res.send('登出')
})

module.exports = router