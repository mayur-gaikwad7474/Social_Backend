const express = require('express')
const router = express.Router()
const Post = require('../Model/post')
const User = require('../Model/user')
const Comment = require('../Model/comments')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require('path')
const fs = require('fs')

router.post('/upload/:id', upload.single('photo'), async (req, res) => {
    try {
        if (req.file) {
            const user = await User.findById(req.params.id)
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
})

router.post('/like/:postid/:userid', async (req, res) => {
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
})

router.post('/dislike/:postid/:userid', async (req, res) => {
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
})

router.post('/comment/:postid/:userid', async (req, res) => {
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
})

router.get('/comments/:postid', async (req, res) => {
    try {
        const commentData = await Comment.find({ postId: req.params.postid })
        res.send(commentData)
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            message: 'incomplete'
        })
    }
})


//Route GET social/post/all
router.get('/all', async (req, res) => {
    try {
        let data = await Post.find({}).sort({ timestamp: -1 })
        res.send(data)
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            message: 'incomplete'
        })
    }
})

//Route GET social/post/image/id
router.get('/image/:id', async (req, res) => {
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
})


module.exports = router