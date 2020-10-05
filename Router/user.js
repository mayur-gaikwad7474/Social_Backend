const express = require('express')
const router = express.Router()
const User = require('../Model/user')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const upload = multer({ dest: 'userProfile/' })
const path = require('path')
const fs = require('fs')


//@Route POST social/user/signup
router.post('/signup', upload.single('image'), async (req, res) => {
  try {

    const userObject = {
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName,
      path: "../" + req.file.path,
      mimetype: req.file.mimetype
    }

    const data = await User.create(userObject)
    let token = jwt.sign({
      id: data._id
    }, 'secret', { expiresIn: '1h' });
    res.status(201).json({
      message: 'completed',
      token: token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: "Something went wrong",
      message: 'incomplete'
    })
  }
})

//@Route POST social/user/login
router.post('/login', async (req, res) => {
  try {
    const data = await User.findOne({ email: req.body.email, password: req.body.password })
    if (data === null) {
      res.status(404).json({
        message: 'incomplete',
        data: 'not found'
      })
    } else {
      let token = jwt.sign({
        id: data._id
      }, 'secret', { expiresIn: '1h' });
      res.status(200).json({
        message: 'completed',
        token: token
      })
    }
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
      message: 'Incomplete'
    })
  }
})

router.get('/all', async (req, res) => {
  try {
    const data = await User.find({})
    res.send(data)
  } catch (error) {

  }
})

router.get('/image/:id', async (req, res) => {
  try {
    let data = await User.findById(req.params.id)
    const path1 = path.join(__dirname, `${data.path}`)
    const head = {
      'Content-Type': data.mimetype,
    }
    res.writeHead(200, head)
    fs.createReadStream(path1).pipe(res)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: "Something went wrong",
      message: 'incomplete'
    })
  }
})

module.exports = router