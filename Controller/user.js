const User = require('../Model/user')
const jwt = require('jsonwebtoken');
const path = require('path')
const fs = require('fs');

// @desc create the user and generate the token
const signUpUser = async (req, res) => {
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
}

// @desc find the user and if found generate the token
const loginUser = async (req, res) => {
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
}

// @desc find all users in the database
const findAllUsers = async (req, res) => {
    try {
        const data = await User.find({})
        res.send(data)
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
            message: 'incomplete'
        })
    }
}

// @desc show the profile image of user
const showProfileImage = async (req, res) => {
    try {
        let data = await User.findById(req.params.id)
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
    signUpUser,
    loginUser,
    findAllUsers,
    showProfileImage
}