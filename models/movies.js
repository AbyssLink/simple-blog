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