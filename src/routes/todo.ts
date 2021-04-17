import * as express from 'express'
import { Router, Request, Response, NextFunction } from 'express';
import { userModel, todoModel } from '../models';
import { isLoggedIn } from './middleware';

const todoRouter = express.Router();

/**
 * @swagger
 * /todo:
 *  post:
 *   tags: 
 *    - Todo
 *   description: 할 일 추가
 *   sumarary: 할 일 추가
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:   
 *      schema:
 *       $ref: '#/components/requestBodies/todo'
 */
todoRouter.post('', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    try {
      // need 'list_id', 'content' in req.body
      if (req.body.list_id && req.body.content) {
        if (req.user) {
          const data = {...req.body, user_id: req.user.id}
          const newTodo = await todoModel.addTodo(data)
          if (newTodo) {
            return res.status(200).json(newTodo)
          } else {
            return res.status(400).json({ 'message': 'no created new todo' })
          }
        }  else {
          return res.status(400).json('no user to add new todo')
        }
      } else {
        return res.status(400).json('no content or list_id in body')
      }
      
    } catch (err) {
      console.error(err);
      next(err);
    }
})

export default todoRouter