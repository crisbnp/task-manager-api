const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//create endpoint for tasks
router.post('/tasks', auth, async(req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        author: req.user._id
    })
    console.log(task)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
       
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })

})

// GET /tasks - all tasks | Reading endpoints for fetching all tasks
// GET /tasks?completed=true
// GET /tasks?limit=5&skip=10
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    } 

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const tasks = await Task.find({ author: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
    
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, author: req.user._id})
        
        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

//update a task
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedtoUpdate = ['description', 'completed']
    const isUpdateValidated = updates.every((update) => {
        return allowedtoUpdate.includes(update)
    })

    if (!isUpdateValidated) {
        return res.status(400).send({error: 'Invalid update, try again.'})
    }

    try {
        //find the task
        const task = await Task.findOne({_id, author: req.user._id}) 
    
        if (!task) {
            return res.status(404).send()
        }

        //Change the task properties (update)
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send()
    }
})


//Delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findByIdAndDelete(_id)
        const task = await Task.findOneAndDelete({_id, author: req.user._id})
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router;