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

        const data = await Log.aggregate([{ $sort: { createdAt: -1 } }])
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
            nextPage: hasNextPage ? nextPage : null,
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
    res.render('contact', {
        locals: locals.contact,
        siteKey: process.env.GOOGLE_CAPTCHA_SITE_KEY,
        success_msg: res.locals.success_msg,
        error_msg: res.locals.error_msg,
    })
})

/**
 * POST /send email
 */
router.post('/send-email', async (req, res) => {
    const {
        name,
        email,
        subject,
        message,
        'g-recaptcha-response': recaptchaToken,
    } = req.body

    if (!name || !email || !subject || !message || !recaptchaToken) {
        req.flash('error_msg', 'Missing required fields')
        return res.redirect('/contact')
    }

    try {
        // Verify the reCAPTCHA token
        const isRecaptchaValid = verifyRecaptcha(recaptchaToken)

        if (!isRecaptchaValid) {
            req.flash(
                'error_msg',
                'reCAPTCHA verification failed. Please try again.'
            )
            return res.redirect('/contact')
        }

        if (!isEmailValid(email)) {
            req.flash('error_msg', 'Invalid email')
            return res.redirect('/contact')
        }
        // Send email using Mailjet
        const emailSent = await sendEmail({
            to: process.env.ADMIN_EMAIL,
            name: 'Contact',
            subject: `New Contact Form Submission: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `<h3>New Contact Form</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong> ${message}</p>`,
            sender: {
                email: email,
                name: name,
            },
        })
        if (emailSent) {
            req.flash('success_msg', 'Your message has been sent successfully!')
        } else {
            req.flash(
                'error_msg',
                'Failed to send email. Please try again later.'
            )
        }

        res.redirect('/email-sent')
    } catch (error) {
        console.error('reCAPTCHA verification error:', error)
        req.flash('error_msg', 'An error occurred. Please try again later.')
        return res.redirect('/contact')
    }
})

/**
 * GET /email-sent
 */
router.get('/email-sent', (req, res) => {
    res.render('email-sent', { locals: locals.emailSent })
})

/**
 * PROJECTS
 */

/**
 * GET /live-project-manager
 */
router.get('/live-project-manager', (req, res) => {
    res.render('projects/live-project-manager', {
        locals: locals.liveProjectManager,
    })
})

/**
 * GET /hotefinder
 */
router.get('/hotefinder', (req, res) => {
    res.render('projects/hotefinder', { locals: locals.hotefinder })
})

/**
 * GET /threejs-double-galaxy
 */
router.get('/threejs-double-galaxy', (req, res) => {
    res.render('projects/threejs-double-galaxy', {
        locals: locals.doubleGalaxy,
    })
})

/**
 * GET /culture shuffle
 */
router.get('/culture-shuffle', (req, res) => {
    res.render('projects/culture-shuffle', { locals: locals.cultureShuffle })
})

/**
 * GET /Eat Around
 */
router.get('/eat-around', (req, res) => {
    res.render('projects/eat-around', { locals: locals.eataround })
})

/**
 * GET /super secret samples
 */
router.get('/super-secret-samples', (req, res) => {
    res.render('projects/super-secret-samples', {
        locals: locals.superSecretSamples,
    })
})

/**
 * GET /skills
 */
router.get('/skills', (req, res) => {
    res.render('skills', {
        locals: locals.skills,
    })
})

module.exports = router
