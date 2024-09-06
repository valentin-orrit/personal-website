const express = require('express')
const router = express.Router()
const locals = require('../config/locals')
const Log = require('../models/Log')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminLayout = '../views/layouts/admin'

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
        const { username, password} = req.body

        res.render('admin/login', { locals: locals.adminLogin, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
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