import * as express from 'express'
import * as swaggerJsDoc from 'swagger-jsdoc'
import * as swaggerUi from 'swagger-ui-express'

import { userRouter } from './routes'

const app = express()

const swggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Express API',
            version: '1.0.0',
        },
    },
    apis: ['./src/app.ts', './src/routes/**.ts'],
}

const swaggerDocs = swaggerJsDoc(swggerOptions)
console.log(swaggerDocs)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// /**
//  * @swagger
//  * /books:
//  *  get:
//  *      description: Get all books
//  *      responses:
//  *          200:
//  *              description: Success
//  */
// app.get('/books', (req, res) => {
//     res.send([
//         {
//             id: 1,
//             title: 'Harry Potter'
//         }
//     ])
// })

app.use('/user', userRouter)

app.listen(5000, () => { 
    console.log('server start')
})