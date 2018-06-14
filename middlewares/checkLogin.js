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