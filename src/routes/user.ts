import * as express from 'express'

const userRouter = express.Router();
/**
 * @swagger
 * /signup:
 *  post:
 *      description: Get all books
 *      responses:
 *          200:
 *              description: Success
 */
userRouter.post('/signup', (req, res) => {
    res.send([
        {
            id: 1,
            title: 'Harry Potter'
        }
    ])
})

/**
 * @swagger
 * /login:
 *  post:
 *      description: Get all books
 *      responses:
 *          200:
 *              description: Success
 */
 userRouter.post('/login', (req, res) => {
    res.send([
        {
            id: 1,
            title: 'Harry Potter'
        }
    ])
})
export default userRouter