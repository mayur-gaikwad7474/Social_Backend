const mongoose = require("mongoose")
const schema = mongoose.Schema

const Post = new schema({
    userId: String,
    caption: String,
    path: String,
    height: String,
    width: String,
    imageSize: String,
    mimetype: String,
    timestamp: {
        date: { type: Date, default: Date.now }
    },
    likes: [String],
    count: { type: Number, default: 0 },
    userName:String
})

module.exports = mongoose.model("Post", Post)