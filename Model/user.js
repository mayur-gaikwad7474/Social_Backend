const mongoose = require('mongoose')
const schema = mongoose.Schema

const User = new schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        trim: true,
        required: 'Password is required',
    },
    userName: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: "User Name is required",
    },
    path:{
        type:String
    },
    mimetype:{
        type:String
    }
})

module.exports = mongoose.model("User", User)