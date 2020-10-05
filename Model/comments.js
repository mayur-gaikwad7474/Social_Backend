const mongoose = require('mongoose')
const schema = mongoose.Schema

const comments = new schema({
    postId: String,
    comments: [{
        name: String,
        body: String,
        date: { type: Date, default: Date.now },
        path: String
    }],
})

module.exports = mongoose.model("Comments", comments)