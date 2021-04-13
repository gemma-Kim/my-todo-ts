import { Router, Request, Response, NextFunction } from 'express';
import { userModel, todoModel } from '../models';
import { isLoggedIn } from './middleware';

const todoRouter = Router();

// get user todos 
todoRouter.get('', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.query.offset && req.query.limit) {
      if (req.query.offset >= req.query.limit) {
        return res.status(400).json('limit should be greater than offset')
      } else {
        if (req.user) {
          const user = await userModel.findUniqueUser({ id: req.user.id })
          if (!user) {
            return res.status(400).json('invalid user')
          } else {
            const todoData = await todoModel.getUserTodo(Number(req.user.id), Number(req.query.offset), Number(req.query.limit))
            return res.status(200).json(todoData[0])
          }
        } else {
          return res.status(400).json('no user to get user\'s lists and todos')
        }
      }
    } else {
      return res.status(400).json('no offset & limit request')
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
})

// add todo list
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

// modify todo list
todoRouter.patch('/:todo_id', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // list_id or content or is_deleted in req.body
    if (req.body.list_id || req.body.content || req.body.is_deleted) {
      if ("content" in req.body && !req.body.content) {
        return res.status(400).json( 'no todo content to update' )
        
      } else {
        const data = { ...req.body, id: Number(req.params.todo_id) }
        const newTodoData = await todoModel.modifyTodo(data)
        if (newTodoData) {
          return res.status(200).json(newTodoData)
        }
        return res.status(400).json( 'no updated todo item' )
      }
      
    } else {
      return res.status(400).json( 'no todo item to update' )
    }
    
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// remove or delete todo list
todoRouter.delete('', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.todo_id && req.body.todo_id === true || false && "is_deleted" in req.body) {
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
