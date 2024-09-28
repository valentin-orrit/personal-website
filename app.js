require('dotenv').config()

const path = require('path')
const express = require('express')
const expressLayout = require('express-ejs-layouts')
const favicon = require('serve-favicon')
const methodOverride = require('method-override')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')

const connectDB = require('./server/config/db')

const app = express()
const PORT = process.env.PORT || 3000

// Connect to DB
connectDB()

app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: { maxAge: 3600000 }
}))

// Flash messages
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')

    next()
})

// Templating Engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))


if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE || !process.env.MJ_SENDER_EMAIL) {
    console.error('Mailjet environment variables are not set.')
    process.exit(1)
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})