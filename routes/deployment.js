const express = require('express')
const Deployment = require('../models/deployment')
const router = express.Router()


const fetch = require('node-fetch')


//All Deployment route
router.get('/', async (req,res) => {
    let query = Deployment.find()
    if (req.query.url != null && req.query.url != '') {
        query = query.regex('url', new RegExp(req.query.url, 'i'))
    }
    if (req.query.name != null && req.query.name != '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if (req.query.deployedAfter != null && req.query.deployedAfter != '') {
        query = query.lte('deployedAfter', req.query.deployedAfter)
    }
    if (req.query.deployedBefore != null && req.query.deployedBefore != '') {
        query = query.gte('deployedBefore', req.query.deployedBefore)
    }
    try {
        const deployments = await query.exec()
        res.render('deployment/index', {
            deployments: deployments,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New Deployment route
router.get('/new', async (req,res) => {
    renderNewPage(res, new Deployment())
})

//Deployment result by
router.get('/show/:id', async (req,res) => {
    //res.send('Show details')
    
    try{
        const deployment = await Deployment.findById(req.params.id)

        res.render('deployment/details', {
            deployment: deployment,
        })
    }catch{
        console.log('error')
        res.redirect('/deployment')
    }
})

//Deployment result by
router.get('/:id', async (req,res) => {
    console.log('GET by id')

    let dirLE = "http://master-cluster2:30442/api/v1/appmanager/repos"
    let dirpost = "http://master-cluster2:30442/api/v1/appmanager/namespaces/default/apps"
    let dirMEO1 = "http://master-cluster2:30442/api/v1/appmanager/repos"
    let dirMEO2 = "http://master-cluster2:30442/api/v1/appmanager/repos"
    let dirMTO = "http://master-cluster2:30442/api/v1/appmanager/repos"

    let bodyMTO = `{"task": "mecpm",
                "rabbitmq": {}, 
                "command": {"action": "deploy", 
                            "namespace": "test"},
                "bodytosend":bodytosend}`
    
    let bodyToSendMTO = ``
    
    try{
        const deployment = await Deployment.findById(req.params.id)
        const rawResponse = await fetch(dirpost, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                release_name: 'pruebaportaldf',
                repochart_name: 'bitnami/nginx',
            })
        })
        
        const content = await rawResponse.json();

        console.log(JSON.stringify(content));

        res.render('deployment/result', {
            deployment: deployment,
            content: JSON.stringify(content)
        })
    }catch{
        console.log('error')
        res.redirect('/deployment')
    }
})

//Create deployment
router.post('/', async (req,res) => {
    console.log('POST')
    const deployment = new Deployment({
        url: req.body.url,
        name: req.body.name,
        namespace: req.body.namespace,
        destination: req.body.destination, 
        dateOfAction: new Date(req.body.depDate),
        description: req.body.description
    })

    try {
        const newDeployment = await deployment.save()
        res.redirect(`deployment/${newDeployment.id}`)
    } catch {
        renderNewPage(res, deployment, true)
    }
})

async function renderNewPage(res, deployment, hasError = false){
    try{
        const params = {
            deployment:deployment
        }
        if (hasError) {
            params.errorMessage = 'Error in the Deployment'
        }
        res.render('deployment/new', params)
    } catch{
        res.redirect('/deployment')
    }
}
module.exports = router