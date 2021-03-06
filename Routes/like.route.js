module.exports = function(app){
    const like = require('../Controllers/like.controller')
    app.route('/v1/like/addLike').post(like.like)
    app.route('/v3/like/countLike/:chat_id').get(like.countLike)
    app.route('/v3/like/isLikeComment/:user_id').get(like.isLikeComment)
}