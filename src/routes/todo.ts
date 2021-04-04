import { Router } from 'express';
import { todoModel } from '../models';
import { isLoggedIn } from './middleware';

const todoRouter = Router();

// add todo list
todoRouter.post('', isLoggedIn, async (req, res, next) => {
  try {
    const newTodo = await todoModel.addTodo(req.body)
    if (newTodo) {
      res.status(200).json(newTodo)
    }
    return res.status(400).json()
  } catch (err) {
    console.error(err);
    next(err);
  }
})

// modify todo list
todoRouter.patch('/:todo_id', isLoggedIn, async (req, res, next) => {
  try {
    if ("content" in req.body && !req.body.content) {
      return res.status(400).json('no content to modify')
    }
    if ("list_id"&&req.body.list_id || "content"&&req.body.content || "is_deleted"&&req.body.is_deleted in req.body) {
      const data = { ...req.body, id: Number(req.params.todo_id) }
      const newTodoData: any = await todoModel.modifyTodo(data);
      return res.status(200).json(newTodoData)
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// remove or delete todo list
todoRouter.delete('/:todo_id', isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.todo_id) {
      await todoModel.deleteTodos([Number(req.params.todo_id)], req.body.is_deleted)
    } else if (req.body.todo_id) {
      await todoModel.deleteTodos(req.body.todo_id, req.body.is_deleted)
    } else {
      return res.status(400).json('nothing to delete todo')
    }
    return res.status(200).json('success to remove todo')
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export default todoRouter;