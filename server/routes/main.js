const express = require('express')
const router = express.Router()
const Log = require('../models/Log')
const locals = require('../config/locals')
const isEmailValid = require('../mailer/email-validator')

/**
 * GET / 
*/
router.get('', (req, res) => {
    
    res.render('index', { locals: locals.index })
})

/**
 * GET /portfolio
*/
router.get('/portfolio', (req, res) => {
    res.render('portfolio', { locals: locals.portfolio })
})

/**
 * GET /logbook
*/
router.get('/logbook', async (req, res) => {
    try {
        let perPage = 10
        let page = req.query.page || 1

        const data = await Log.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec()

        const count = await Log.countDocuments()
        const nextPage = parseInt(page) + 1
        const hasNextPage = nextPage <= Math.ceil(count / perPage)

        res.render('logbook', {
            locals: locals.logbook,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        })

    } catch (error) {
        console.log(error)
    }
    
})

/**
 * GET /log
*/
router.get('/log/:id', async (req, res) => {
    try {
        let slug = req.params.id

        const data = await Log.findById({ _id: slug })
        const logLocals = locals.getLogLocals(data)
        res.render('log', { locals: logLocals, data })
    } catch (error) {
        console.log(error)
    }
})


/**
 * GET /contact
*/
router.get('/contact', (req, res) => {
    res.render('contact', { locals: locals.contact })
})

/**
 * POST /send email
*/
router.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
        res.status(400).json({ status: 'error', message: 'Missing required fields' })
    }

    if (!isEmailValid(email)) {
        return res.status(400).json({ status: 'error', message: 'Invalid email' })
    }

    res.status(200).json({ status: 'success', message: 'Email successfully sent' })
})

module.exports = router