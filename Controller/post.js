const path = require('path')
const fs = require('fs')
const Post = require('../Model/post')
const User = require('../Model/user')
const Comment = require('../Model/comments')

// @desc create the post for the user with perticular id requested
const uploadImage = async (req, res) => {
    try {
        if (req.file) {
            const user = await User.findById(req.params.id)
            // create the postObject according to image and user
            let postObject = {
                userId: req.params.id,
                caption: req.body.caption,
                path: `../${req.file.path}`,
                height: req.body.height,
                width: req.body.width,
                imageSize: req.body.size,
                mimetype: req.file.mimetype,
                userName: user.userName
            }
            const data = await Post.create(postObject)
            res.send(data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Something went wrong",
            message: 'incomplete'
        })
    }
}

// @desc like the post if the post is not liked by the user and if allready liked return response
const likePost = async (req, res) => {
    try {
        const data = await Post.findById(req.params.postid)
        if (data.likes.includes(req.params.userid)) {
            res.status(409).json({
                message: "completed",
                data: "all ready liked"
            })
        } else {
            data.likes.push(req.params.userid)
            data.count = data.count + 1
            data.save()
            res.status(200).json({
                message: "completed",
                data: data
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            message: 'incomplete'
        })
    }
}

// @desc dislike the post if the post is allready disliked return the response
const dislikePost = async (req, res) => {
    try {
        const data = await Post.findById(req.params.postid)
        if (data.likes.includes(req.params.userid)) {
            const arrayIndex = data.likes.indexOf(req.params.userid);
            data.likes.splice(arrayIndex, 1);
            data.count--;
            await data.save()
            res.status(200).json({
                message: "completed",
                data: data
            })
        } else {
            res.status(409).json({
                message: "completed",
                data: "all ready disliked"
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            message: 'incomplete'
        })
    }
}

// @desc create the comment on the perticular post
const commentPost = async (req, res) => {
    try {
        const userData = await User.findById(req.params.userid)
        let commentObject = {
            postId: req.params.postid,
            comments: {
                userId: userData._id,
                name: userData.userName,
                comment: req.body.comment,
            }
        }
        const commentData = await Comment.create(commentObject)
        res.send(commentData)
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            message: 'incomplete'
        })
    }
}

// @desc show the all comments accroding to the postid
const postComments = async (req, res) => {
    try {
        const commentData = await Comment.find({ postId: req.params.postid })
        res.send(commentData)
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            message: 'incomplete'
        })
    }
}

// @desc get all the post as per user request and as per page
const paginationsOfPosts = async (req, res) => {
    try {
        const limit = 5
        const skip = req.params.page || 1 * limit
        let data = await Post.find({})
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
        res.send(data)
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            message: 'incomplete'
        })
    }
}

// @desc send the post image
const postImageToShow = async (req, res) => {
    try {
        let data = await Post.findById(req.params.id)
        const path1 = path.join(__dirname, `${data.path}`)
        const head = {
            'Content-Type': data.mimetype,
        }
        res.writeHead(200, head)
        fs.createReadStream(path1).pipe(res)
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            message: 'incomplete'
        })
    }
}

module.exports = {
    uploadImage,
    likePost,
    dislikePost,
    commentPost,
    postComments,
    paginationsOfPosts,
    postImageToShow
}