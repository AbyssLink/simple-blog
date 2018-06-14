const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/checkLogin').checkLogin

//GET /game 游戏页
router.get('/', function(req, res, next) {
    res.send('游戏排名页')
})

//POST /game/:postId/upload 游戏结果上传页
router.post('/:postId/upload', function(req, res, next) {
    res.send('上传游戏结果')
})

//POST /geme/:postId/remove 游戏结果删除页
router.post('/:postId/remove', function(req, res, next) {
    res.send('删除游戏结果')
})

module.exports = router