const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

/**
 * GET / 
*/
router.get('', (req, res) => {
    const locals = {
        title: 'valentin orrit',
        description: 'Personal website with portfolio and simple blog, created with Nodejs, Express & MongoDB'
    }
    
    res.render('index', { locals })
})

/**
 * GET /portfolio
*/
router.get('/portfolio', (req, res) => {
    res.render('portfolio')
})

/**
 * GET /logbook
*/
router.get('/logbook', (req, res) => {
    res.render('logbook')
})

/**
 * GET /contact
*/
router.get('/contact', (req, res) => {
    res.render('contact')
})

module.exports = router