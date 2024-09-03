const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

/**
 * GET / 
 * HOME
 */

router.get('', (req, res) => {
    const locals = {
        title: 'valentin orrit',
        description: 'Personal website with portfolio and simple blog, created with Nodejs, Express & MongoDB'
    }
    
    res.render('index', { locals })
})

function insertPostData () {
    Post.insertMany([
        {
            title: 'Building a logbook',
            body: 'This is the body text'
        },
        {
            title: 'another one',
            body: 'its another post'
        },
        {
            title: 'another oneeeee',
            body: 'its another postssss'
        }
    ])
}
insertPostData()


router.get('/contact', (req, res) => {
    res.render('contact')
})

module.exports = router