const express = require('express')
const router = express.Router()
const locals = require('../config/locals')
const Log = require('../models/Log')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { marked } = require('marked')

const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET


/**
 * Check Login 
*/
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token

    if(!token) {
        return res.redirect('/unauthorized')
    }

    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.redirect('/unauthorized')     
    }
}

/**
 * GET /admin login
*/
router.get('/admin', async (req, res) => {
    try {
        const token = req.cookies.token
        if (token) {
            jwt.verify(token, jwtSecret, (error, decoded) => {
                if (error) {
                    return res.render('admin/login', { locals: locals.adminLogin, layout: adminLayout })
                } else {
                    return res.render('admin/loggedin', { message: 'Admin Already Logged In', layout: adminLayout })
                }
            })
        } else {
            res.render('admin/login', { locals: locals.adminLogin, layout: adminLayout })
        }
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

    } catch (error) {
        console.log(error)
    }
})

/**
 * GET /admin - dashboard 
*/
router.get('/dashboard', authMiddleware, async (req, res) => {
    
    try {
        const data = await Log.find()
        res.render('admin/dashboard', {locals: locals.adminDashboard, data, layout: adminLayout })
    } catch (error) {
        console.log(error)        
    }
    
})

/**
 * GET /admin - create new log
*/
router.get('/add-log', authMiddleware, async (req, res) => {
    
    try {
        res.render('admin/add-log', {locals: locals.adminAddLog, layout: adminLayout })
    } catch (error) {
        console.log(error)        
    }
    
})

/**
 * POST /admin - create new log
*/
router.post('/add-log', authMiddleware, async (req, res) => {
    try {
        const newLog = new Log({
            title: req.body.title,
            body: req.body.body,
            bodyHtml: marked(req.body.body)
        })

        await Log.create(newLog)
        res.redirect('/dashboard')

    } catch (error) {
        console.log(error)        
    }
})

/**
 * GET /admin - edit log
*/
router.get('/edit-log/:id', authMiddleware, async (req, res) => {
    try {
        const data = await Log.findOne({ _id: req.params.id })

        res.render('admin/edit-log', { data })

    } catch (error) {
        console.log(error)        
    }
})

/**
 * PUT /admin - edit log
*/
router.put('/edit-log/:id', authMiddleware, async (req, res) => {
    try {
        await Log.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            bodyHtml: marked(req.body.body),
            updatedAt: Date.now()
        })

        res.redirect(`/log/${req.params.id}`)

    } catch (error) {
        console.log(error)        
    }
})

/**
 * DELETE /admin - delete log
*/
router.delete('/delete-log/:id', authMiddleware, async (req, res) => {
    try {
        await Log.deleteOne( { _id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)        
    }
})
    

/**
 * POST /admin unauthorized 
*/
router.get('/unauthorized', async (req, res) => {
    res.render('admin/unauthorized')
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