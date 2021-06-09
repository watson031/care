const express = require('express')
const cors = require('cors')
const userRoute = require('./src/routes/user')
const roleRoute = require('./src/routes/role')
const establishmentRoute = require('./src/routes/establishment')
const serviceRoute = require('./src/routes/service')
const followUpRoute = require('./src/routes/medical-follow-up')
const messageRoute = require('./src/routes/message')
const questionRoute = require('./src/routes/question')
const noteRoute = require('./src/routes/note')
const app = express()
const { swaggerUI, swaggerDocs } = require('./swagger.config')
const PORT = process.env.PORT || 5000
// CORS for development
// https:// enable-cors.org/server_expressjs.html
app.use(function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    response.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS')
    response.header('Access-Control-Allow-Credentials', 'false')
    next()
})
// app.use(function (req, res) {
//     res.send('<h1 style="text-align:center;color:red;">Sorry, I\'m down</h1>')
// })
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: 'POST, PUT, GET, DELETE, OPTIONS'
}

// for parsing application/json
app.use(express.json())
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// for cors
app.use(cors(corsOptions))

// endPoint pour acceder a la documentation de l'API
app.use('/documentation', express.static('api-documentation'))
app.use('/public', express.static('public'))

// Redirection vers la page de la documention de l'api
// app.get('/', (req, res) => {
//     res.redirect('https://care-project.herokuapp.com/care-api/')
// })

app.use('/care-api', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
// Rouutes section
app.use('/establishment', establishmentRoute)
app.use('/user', userRoute)
app.use('/role', roleRoute)
app.use('/service', serviceRoute)
app.use('/medical-follow-up', followUpRoute)
app.use('/message', messageRoute)
app.use('/question', questionRoute)
app.use('/note', noteRoute)

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
