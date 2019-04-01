const mongoose = require('mongoose')
const validator = require('validator')

//Define connection to database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, 
    useCreateIndex: true, //to make sure when monogoose work with mongodb, index is created to allow us to access data easily
    useFindAndModify: false
})

// //define model using constructor
// const User =  mongoose.model('User' , {
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if(value < 0) {
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 7,
//         trim: true,
//         validate(value) {
//             if (value.toLowerCase().includes('password')) {
//                 throw new Error('Password must not contain the word "password"')
//             }
            
//         }
//     }

// })

// //create instance of the model
// const me = new User({
//     name: '    Cristien    ',
//     email: 'CRIS@mail.com   ',
//     password: '12Password'
// })

// //saving the instance to database
// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('error', error)
// })

//Define model with description and completed fields
// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     }, 
//     completed : {
//         type: Boolean,
//         default: false,
//     }
// })

// //Create a new instance of the Task model
// const wash = new Task({
//     description: " -- ",
// })

// //Save the model to database
// wash.save().then(() => {
//     console.log(wash)
// }).catch((error) => {
//     console.log("Error", error)
// })

