const express = require('express')
const router = express.Router()

// Routes
router.get('', (req, res) => {
    const locals = {
        title: 'valentin orrit',
        description: 'Personal website with portfolio and simple blog, created with Nodejs, Express & MongoDB'
    }
    
    res.render('index', { locals })
})

router.get('/contact', (req, res) => {
    res.render('contact')
})

module.exports = router