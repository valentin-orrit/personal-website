require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')

const connectDB = require('./server/config/db')

const app = express()
const PORT = process.env.PORT || 3000

// Connect to DB
connectDB()

app.use(express.static('public'))

// Templating Engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})