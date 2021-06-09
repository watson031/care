const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Care API',
            version: '1.0.0'
        }
    },
    apis: ['src/routes/user.js', 'src/routes/role.js', 'src/routes/establishment.js', 'src/routes/service.js', 'src/routes/medical-follow-up.js',
        'src/routes/message.js', 'src/routes/note.js']

}
const swaggerDocs = swaggerJsDoc(swaggerOptions)

module.exports = { swaggerUI, swaggerDocs }
