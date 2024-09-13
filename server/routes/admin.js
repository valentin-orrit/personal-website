const express = require('express')
const router = express.Router()
const locals = require('../config/locals')
const Log = require('../models/Log')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET

/**
 * GET /admin login
*/
router.get('/admin', async (req, res) => {
    try {
        res.render('admin/login', { locals: locals.adminLogin, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})

/**
 * POST /admin check login
*/
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body
        console.log('Received credentials:', { username, password })

        const user = await User.findOne( { username } )

        if(!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })            
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret)
        res.cookie('token', token, { httpOnly: true })

        res.redirect('/dashboard')

        // res.render('admin/login', { locals: locals.adminLogin, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})

/**
 * POST /admin dashboard 
*/
router.get('/dashboard', async (req, res) => {
    res.render('admin/dashboard')
})


/**
 * POST /admin register 
*/
router.post('/register', async (req, res) => {
    try {
        const { username, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        try {
            const user = await User.create({ username, password:hashedPassword})
            res.status(201).json({ message: 'User Created', user})
        } catch (error) {
            if(error.code === 11000) {
                res.status(409).json({ message: 'User already in use'})
            }
            res.status(500).json({ message: 'Internal server error'})
        }
    } catch (error) {
        console.log(error)
    }
})


module.exports = router