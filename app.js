require('dotenv').config()
const cors = require('cors')
const mainRouter = require('./routers/index.js')

const errorHandler = require('./middlewares/error_handler.js')

const express = require('express')

const port = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api', mainRouter)

app.use(errorHandler)

const startServer = async () => {
    try {
        app.listen(port, console.log(`App Port: ${port}`))
    } catch(e) {
        console.log(e)
    }
}

startServer()