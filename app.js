require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')

const connectDB = require('./server/config/db')

const app = express()
const PORT = process.env.PORT || 3000

// Connect to DB
connectDB()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitiliazed: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })

    //cookie: {maxAge: new Date (Date.now() + (3600000)) }
}))

// Templating Engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})