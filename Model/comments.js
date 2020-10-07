const mongoose = require('mongoose')
const schema = mongoose.Schema

const comments = new schema({
    postId: String,
    comments: {
        userId: String,
        name: String,
        comment: String,
        date: { type: Date, default: Date.now },
    },
})

module.exports = mongoose.model("Comments", comments)