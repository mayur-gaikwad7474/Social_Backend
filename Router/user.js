const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'userProfile/' })
const { signUpUser, loginUser, findAllUsers, showProfileImage } = require('../Controller/user');

//@Route POST social/user/signup
router.post('/signup', upload.single('image'), signUpUser)

//@Route POST social/user/login
router.post('/login', loginUser)

//@Route GET social/user/all
router.get('/all', findAllUsers)

//@Route GET social/user/image/id
router.get('/image/:id', showProfileImage)

module.exports = router