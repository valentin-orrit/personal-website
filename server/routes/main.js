const express = require('express')
const router = express.Router()
const Log = require('../models/Log')
const locals = require('../config/locals')
const isEmailValid = require('../mailer/email-validator')
const verifyRecaptcha = require('../mailer/verify-recaptcha')
const { sendEmail } = require('../mailer/mailer')

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
router.get('/contact', async (req, res) => {
    res.render('contact', { locals: locals.contact, siteKey: process.env.GOOGLE_CAPTCHA_SITE_KEY })
})

/**
 * POST /send email
*/
router.post('/send-email', async (req, res) => {
    const { name, email, subject, message, 'g-recaptcha-response': recaptchaToken } = req.body

    if (!name || !email || !subject || !message || !recaptchaToken) {
        res.status(400).json({ status: 'error', message: 'Missing required fields' })
    }

    // Verify the reCAPTCHA token
   const isRecaptchaValid = verifyRecaptcha(recaptchaToken)

   if (!isRecaptchaValid) {
       return res.status(400).json({
           status: 'error',
           message: 'reCAPTCHA verification failed. Please try again.'
       })
   }

    if (!isEmailValid(email)) {
        return res.status(400).json({ status: 'error', message: 'Invalid email' })
    }

    // Send email using Mailjet
    const emailSent = await sendEmail({
        to: process.env.ADMIN_EMAIL,
        name: "Contact",
        subject: `New Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<h3>New Contact Form</h3>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Subject:</strong> ${subject}</p>
               <p><strong>Message:</strong> ${message}</p>`,
        sender: {
            email: email,
            name: name
        }
    })

    if (emailSent) {
        res.status(200).json({ status: 'success', message: 'Email successfully sent' })
    } else {
        res.status(500).json({ status: 'error', message: 'Failed to send email' })
    }
})

module.exports = router