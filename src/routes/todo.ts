import { Router } from 'express';
import { todoModel } from '../models';
import { isLoggedIn } from './middleware';

const todoRouter = Router();

// add todo list
todoRouter.post('', isLoggedIn, async (req, res, next) => {
  const newTodo = await todoModel.addTodo( { ...req.body })
  if (newTodo) {
    res.status(200).json( { ...newTodo })
  }
})

export default todoRouter;