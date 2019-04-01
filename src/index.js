const express = require('express')
require('./db/mongoose') //by requiring this file, we ensure that mongoose is connecting to db

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json()) //parse incoming json as object
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

