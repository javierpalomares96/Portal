const mongoose = require('mongoose')

const migrationSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Migration', migrationSchema)