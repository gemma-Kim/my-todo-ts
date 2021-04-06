import { Router, Request, Response, NextFunction } from 'express';
import { userModel, todoModel } from '../models';
import { isLoggedIn } from './middleware';

const todoRouter = Router();

// get user todos 
todoRouter.get('/todos?', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.query.offset && req.query.limit) {
      if (req.query.offset > req.query.limit) {
        res.status(400).json('limit should be greater than offset')
      }
      if (req.user) {
        const user = await userModel.findUniqueUser({ id: req.user.id })
        if (!user) {
          res.status(400).json('invalid user')
        } else {
          const todoData = await todoModel.getUserTodo(Number(req.user.id), Number(req.query.offset), Number(req.query.limit))
          res.status(200).json(todoData[0])
        }
      }

    } else {
      res.status(400)
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
})
// add todo list
todoRouter.post('', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // need 'content', 'list_id', 'user_id' in req.body
    const newTodo = await todoModel.addTodo(req.body)
    if (newTodo) {
      res.status(200).json(newTodo)
    } res.status(400).json( {'message': 'no created new todo'})
    
  } catch (err) {
    console.error(err);
    next(err);
  }
})

// modify todo list
todoRouter.patch(':todo_id', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // need 'user_id', (list_id or content or is_deleted) in req.body
    if ("content" in req.body && !req.body.content) {
      res.status(400).json('no content to modify')
    }
    if ("list_id"&&req.body.list_id || "content"&&req.body.content || "is_deleted"&&req.body.is_deleted in req.body) {
      const data = { ...req.body, id: Number(req.params.todo_id) }
      const newTodoData = await todoModel.modifyTodo(data);
      res.status(200).json(newTodoData)
    } else {
      res.status(400).json( {'message': 'no todo item to update'})
    }
    
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// remove or delete todo list
todoRouter.delete('', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.todo_id && "is_deleted" in req.body) {
      await todoModel.deleteTodos(req.body.todo_id, req.body.is_deleted)
      res.status(200).json({ 'message': 'success to remove todo' })
    } else {
      res.status(400).json({ 'message': 'no todo item to delete' })
    }

  } catch (err) {
    console.error(err)
    next(err)
  }
})

export default todoRouter;
