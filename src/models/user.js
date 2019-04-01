const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const Task = require('./task')
 
//create schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: { 
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true, //creating an index in MongoDB database to guarantee uniqueness
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not contain the word "password"')
            }
            
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer //storing the buffer with binary image data, in the db alongside the user
    }

},)

//create a virtual property - a relationship between 2 entities (between user and task)
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', //where the local data is stored
    foreignField: 'author' //name of the field on the task that creates the relationship
})


//individual instance methods fn for generating public profile/ deleting pw and tokens
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()  //to get raw profile data
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//individual instance methods fn for generating authentication token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

//database User method fn
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//Hash the plain text password before saving (middleware)
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//Delete user tasks when user is removed (middleware)
userSchema.pre('remove', async function (next) {
    const user = this

    await Task.deleteMany({
        author: user._id
    })

    next()
})


//define model using constructor
const User =  mongoose.model('User' , userSchema )

module.exports = User