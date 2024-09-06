const express = require('express')
const router = express.Router()
const locals = require('../config/locals')
const Log = require('../models/Log')

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



module.exports = router