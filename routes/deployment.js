const express = require('express')
const Deployment = require('../models/deployment')
const router = express.Router()


const fetch = require('node-fetch')
const { response } = require('express')


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

//Deployment details
router.get('/show/:id', async (req,res) => {  
    try{
        const deployment = await Deployment.findById(req.params.id)
        res.render('deployment/result', {
            deployment: deployment,
        })
    }catch{
        console.log('error')
        res.redirect('/deployment')
    }
})

//Deployment result by
router.get('/:id', async (req,res) => {

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
    let data = []
    try{
        const deployment = await Deployment.findById(req.params.id)
        const rawResponse = await fetch(dirpost, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                release_name: deployment.name,
                repochart_name: 'bitnami/nginx',
            })
        })
        data = await rawResponse.text()
        
        if(data === ''){
            data = `{
                "title": "Deployed Successfully",
                "status_code": 201,
                "detail": "App deployed successfully"
            }`
        }
            
        deployment.response = data
        const newDeployment = await deployment.save()

        res.render('deployment/result', {
            deployment: newDeployment,
        })
    }catch{
        res.redirect('/deployment')
    }
})

//Create deployment
router.post('/', async (req,res) => {
    const deployment = new Deployment({
        url: req.body.url.toLowerCase(),
        name: req.body.name.toLowerCase(),
        namespace: req.body.namespace.toLowerCase(),
        destination: req.body.destination.toLowerCase(), 
        dateOfAction: new Date(req.body.depDate),
        description: req.body.description,
        response: req.body.response
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