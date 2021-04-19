import { Router } from 'express'
import { isLoggedIn } from './middleware'

const listRouter = Router();

listRouter.get('/:list_id', isLoggedIn, (req, res) => {
    try {

    } catch (err) { 

    }
})

export default {
    listRouter
}