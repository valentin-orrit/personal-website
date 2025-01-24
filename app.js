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
const helmet = require('helmet')
const crypto = require('crypto')

const connectDB = require('./server/config/db')

const app = express()
const PORT = process.env.PORT || 3001

// Connect to DB
connectDB()

// Use Helmet middleware
app.use(helmet())

// Set Content Security Policy
app.use((req, res, next) => {
    // Generate a new nonce for each request
    const nonce = crypto.randomBytes(16).toString('base64')

    // Set the nonce in res.locals so it can be accessed in your views
    res.locals.nonce = nonce

    // Define CSP directives
    const cspDirectives = {
        'default-src': ["'self'"],
        'base-uri': ["'none'"],
        'script-src': [
            "'self'",
            "'nonce-" + nonce + "'",
            "'unsafe-inline'",
            'https://www.google.com/recaptcha/',
            'https://www.gstatic.com',
        ],
        'script-src-elem': [
            "'self'",
            "'nonce-" + nonce + "'",
            'https://www.google.com/recaptcha/',
            'https://www.gstatic.com',
        ],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https://www.gstatic.com'],
        'connect-src': ["'self'"],
        'font-src': ["'self'"],
        'object-src': ["'none'"],
        'media-src': ["'self'"],
        'frame-src': ['https://www.google.com'],
    }

    // Convert directives object to string
    const csp = Object.entries(cspDirectives)
        .map(([key, value]) => `${key} ${value.join(' ')}`)
        .join('; ')

    res.setHeader('Content-Security-Policy', csp)
    next()
})

app.use(express.static('public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
        cookie: {
            maxAge: 3600000,
            sameSite: 'Lax',
            secure: true,
            httpOnly: true,
        },
    })
)

// Flash messages
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

// Serve translation files
app.get('/translations/:file', (req, res) => {
    const filePath = path.join(
        __dirname,
        'server',
        'translations',
        req.params.file
    )
    res.sendFile(filePath)
})

// Templating Engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))

if (
    !process.env.MJ_APIKEY_PUBLIC ||
    !process.env.MJ_APIKEY_PRIVATE ||
    !process.env.MJ_SENDER_EMAIL
) {
    console.error('Mailjet environment variables are not set.')
    process.exit(1)
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`)
})
