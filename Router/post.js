const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { uploadImage, likePost, dislikePost, commentPost, postComments, paginationsOfPosts, postImageToShow } = require('../Controller/post')

//Route POST social/post/upload/id
router.post('/upload/:id', upload.single('photo'), uploadImage)

//Route POST social/post/like/postid/userid
router.post('/like/:postid/:userid', likePost)

//Route POST social/post/dislike/postid/userid
router.post('/dislike/:postid/:userid', dislikePost)

//Route POST social/post/comment/postid/userid
router.post('/comment/:postid/:userid', commentPost)

//Route GET social/post/comments/postid
router.get('/comments/:postid', postComments)

//Route GET social/post/all/page
router.get('/all/:page', paginationsOfPosts)

//Route GET social/post/image/id
router.get('/image/:id', postImageToShow)


module.exports = router