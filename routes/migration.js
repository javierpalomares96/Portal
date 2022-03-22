const express = require('express')
const Migration = require('../models/migration')
const router = express.Router()


const fetch = require('node-fetch')


//Migration route
router.get('/', (req,res) => {
    res.render('migration/index', { migration: new Migration()})
})

//Create migration
router.post('/', async (req,res) => {
    
    //GET documentation or repos
    /*let dir = "http://master-cluster2:30442/api/v1/appmanager/repos"

    fetch(dir)
        .then(res => res.text())
        .then(text => res.send(text))*/

    const migration = new Migration({
        url: req.body.URL
    })
    try{
        const newMigration = await migration.save()
        //res.redirect(`migration/${newMigration.id}`)
        res.redirect('migration/')
        console.log("Migrating")
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