import { Router, Request, Response, NextFunction } from 'express'
import { isLoggedIn } from './middleware';
import { listModel } from '../models'

const listRouter = Router();

// add list
listRouter.post('', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {

})

// modify list : title or default
listRouter.patch('/:list_id', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {

})

// remove or delete list
listRouter.delete('/:list_id', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {

})

export default listRouter
