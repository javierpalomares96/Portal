const express = require('express')
const Migration = require('../models/migration')
const router = express.Router()


const fetch = require('node-fetch')


//Migration route
router.get('/', async (req,res) => {
    //res.send('Migration history')
    let searchOptions = {}
    if (req.query.url != null && req.query.url !== '') {
        searchOptions.url = new RegExp(req.query.url, 'i')
    }
    try {
        const migrations = await Migration.find(searchOptions)
        res.render('migration/index', {
        migrations: migrations,
        searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//Migration result
router.get('/result', async (req,res) => {
    res.send('Migration result')
})

//New Migrations route
router.get('/new', async (req,res) => {
    res.render('migration/new', { migration: new Migration()})
})

//Create migration
router.post('/', async (req,res) => {
    const migration = new Migration({
        url: req.body.URL
    })
    try{
        const newMigration = await migration.save()
        //res.redirect(`migration/${newMigration.id}`)
        res.redirect('migration/result')
        //res.send(req.body.URL)
    } catch {
        res.render('migration', {
            migration: migration,
            errorMessage: 'Error migrating'
        })
        console.log("Error")

    }
})

module.exports = router