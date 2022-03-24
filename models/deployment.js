const mongoose = require('mongoose')

const deploymentSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String 
    },
    namespace: {
        type: String 
    },
    destination: {
        type: String 
    },
    dateOfAction: {
        type: Date,
        required:true,
        default: Date.now 
    },
    description: {
        type: String 
    }
})

module.exports = mongoose.model('Deployment', deploymentSchema)