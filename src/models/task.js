const mongoose = require('mongoose')

//Create Task Schema
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' //reference to another model to create the relationship between 2 
    }
}, {
    timestamps: true
})



//Define model with description and completed fields
const Task = mongoose.model('Task', taskSchema)

module.exports = Task