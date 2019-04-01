const express =  require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')

const router = new express.Router() //create a new instance of express router


//Resource creation endpoints for users and tasks
router.post('/users', async (req, res) => {
    const user = new User(req.body) //create an instance of user from the frontend

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    } catch (error) {  
        res.status(400).send(error)
    }

    // user.save().then(() => { //saving the user to database
    //     res.status(201).send(user)
    // }).catch((error) => {
    //     res.status(400).send(error) //sending error status and sending error response body
    // }) 
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send() 
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }

})



//resource reading endpoints
router.get('/users/me', auth ,async (req, res) => {
    res.send(req.user)
})

//update endpoint for users
router.patch('/users/me', auth , async (req,res) => {
    
    const updates = Object.keys(req.body) //this returns an array of string of the key properties from the object
    const allowedtoUpdate = ["name", "age", "password", "email"]
    const isUpdateValidated = updates.every((update) => {
        return allowedtoUpdate.includes(update)
    })

    if (!isUpdateValidated) {
        return res.status(400).send({error: 'Update not validated, please update the correct information'})
    }

    try {
     
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        res.send(req.user)
        
    } catch (error) {
        res.status(400).send()
    }
})

//Delete endpoint 
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)

    } catch (error) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: { 
        fileSize: 1000000 //bytes
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg|jpeg|)$/)) {
            return cb(new Error('Please upload the correct image files (png/jpg/jpeg)'))
        }

        cb(undefined, true)
    }

})

// POST avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

// DEL avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    
    res.send()
})

//fetching avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)
        
        if (!user || !user.avatar) {
            throw new Error()
        }

        //send correct data and what types (i.e jpg/png) - set response Header
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router