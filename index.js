const express = require('express')
const mongoose = require('mongoose')
const compression = require('compression')
const cors = require('cors')

//declare the app
const app = express()

app.use(compression())
app.use(cors())
app.use(express.json())
app.use('/social/user', require('./Router/user'))
app.use('/social/post', require('./Router/post'))

try {
    //'mongodb+srv://Roshan:3BrOr8xsdbwOlqGw@cluster0.hetj0.mongodb.net/Social?retryWrites=true&w=majority'
    //mongodb://localhost:27017/social
    mongoose.connect("mongodb+srv://Roshan:3BrOr8xsdbwOlqGw@cluster0.hetj0.mongodb.net/Social?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
} catch (error) {
    console.log(error)
}

app.listen(process.env.PORT || 4000, () => {
    console.log("server listening")
})