const express = require('express')
const router = express.Router()
const Log = require('../models/Log')

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
        res.render('log', { data })
    } catch (error) {
        
    }
})


/**
 * GET /contact
*/
router.get('/contact', (req, res) => {
    res.render('contact')
})

module.exports = router