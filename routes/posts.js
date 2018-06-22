const express = require('express')
const router = express.Router()

// 获取发表文章的模型
const PostModel = require('../models/posts')
    // 获取获得评论的模型
const CommentModel = require('../models/comments')
const checkLogin = require('../middlewares/checkLogin').checkLogin

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function(req, res, next) {
    const author = req.query.author

    PostModel.getPosts(author)
        .then(function(posts) {
            res.render('posts', {
                posts: posts
            })
        })
        .catch(next)
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function(req, res, next) {
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('Please Enter Title!')
        }
        if (!content.length) {
            throw new Error('Please Enter Content!')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    let post = {
        author: author,
        title: title,
        content: content
    }

    PostModel.create(post)
        .then(function(result) {
            // 此 post 是插入 mongodb 后的值，包含 _id
            post = result.ops[0]
            req.flash('success', 'Post successfully!')
                // 发表成功后跳转到该文章页
            res.redirect(`/posts/${post._id}`)
        })
        .catch(next)
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function(req, res, next) {
    res.render('create')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function(req, res, next) {
    const postId = req.params.postId

    Promise.all([
            PostModel.getPostById(postId), // 获取文章信息
            CommentModel.getComments(postId), // 获取该文章所有留言
            PostModel.incPv(postId) // pv 加 1
        ])
        .then(function(result) {
            const post = result[0]
            const comments = result[1]

            if (!post) {
                throw new Error('No Such Article!')
            }

            res.render('post', {
                post: post,
                comments: comments
            })
        })
        .catch(next)
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    const postId = req.params.postId
    const author = req.session.user._id

    PostModel.getRawPostById(postId)
        .then(function(post) {
            if (!post) {
                throw new Error('No such article!')
            }

            // 非原作者无法修改文章
            if (author.toString() !== post.author._id.toString()) {
                throw new Error('No permission!')
            }
            res.render('edit', {
                post: post
            })
        })
        .catch(next)
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    const postId = req.params.postId
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('Please Enter Title!')
        }
        if (!content.length) {
            throw new Error('Please Enter content!')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    PostModel.getRawPostById(postId)
        .then(function(post) {
            if (!post) {
                throw new Error('No such article!')
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error('No permission!')
            }
            PostModel.updatePostById(postId, {
                    title: title,
                    content: content
                })
                .then(function() {
                    req.flash('success', 'Edit article successfully')
                        // 编辑成功后跳转到上一页
                    res.redirect(`/posts/${postId}`)
                })
                .catch(next)
        })
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
    const postId = req.params.postId
    const author = req.session.user._id

    PostModel.getRawPostById(postId)
        .then(function(post) {
            if (!post) {
                throw new Error('No such article!')
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error('No permission!')
            }
            PostModel.delPostById(postId)
                .then(function() {
                    req.flash('success', 'remove article successfully!')
                        // 删除成功后跳转到主页
                    res.redirect('/posts')
                })
                .catch(next)
        })
})

module.exports = router