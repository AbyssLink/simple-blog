const express = require('express')
const router = express.Router()

const MovieModel = require('../models/movies')
const checkLogin = require('../middlewares/checkLogin').checkLogin

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
            res.render('createMovie')
        })
        .catch(next)

})

// 删除电影页
router.get('/:movieId/remove', checkLogin, function(req, res, next) {
    const movieId = req.params.movieId

    MovieModel.getMovieById(movieId)
        .then(function(movie) {
            if (!movie) {
                throw new Error('No movie!')
            }
            MovieModel.delMovieById(movieId)
                .then(function() {
                    req.flash('success', 'remove Movie successfully!')
                    // 删除成功后跳转到上一页
                    res.redirect('back')
                })
                .catch(next)
        })
})

module.exports = router