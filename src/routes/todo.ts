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
 *   parameters:
 *    - in: cookie
 *      name: connect.sid
 *      schema:
 *       type: string
 *   sumarary: 할 일 추가
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:   
 *      schema:
 *       $ref: '#/components/requestBodies/todo'
 *   responses:
 *    200:
 *     description: todo 추가 성공
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/add_todo_success'
 *    400:
 *     description: 잘못된 요청
 *     content:
 *      application/json:
 *        schema:
 *         $ref: '#/components/responses/default'
 *        examples:
 *         잘못된 요청:
 *          value:
 *           error_message: 잘못된 요청입니다.
 *         할일이 생성되지 않음:
 *          value:
 *           error_message: no created new todo
 *    401:
 *     description: 인증되지 않은 사용자
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/default'
 *       example:
 *        error_message: 로그인이 필요합니다.
 *    404:
 *     description: 
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/default'
 *       example:
 *        error_message: no content or list_id in body
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
            return res.status(400).json({ 'error_message': 'no created new todo' })
          }
        }  else {
          return res.status(400).json({ 'errror_message': '잘못된 요청입니다.' })
        }
      } else {
        return res.status(404).json({ 'error_message': 'no content or list_id in body' })
      }
      
    } catch (err) {
      console.error(err);
      next(err);
    }
})


/**
 * @swagger
 *  /todo/{todo_id}:
 *   patch:
 *    tags:
 *     - Todo
 *    description: 할 일 수정
 *    summary: 할 일 수정
 *    parameters:
 *     - in: cookie
 *       name: connect.sid
 *       summary: 사용자 인증 세션 아이디
 *       schema:
 *        type: string
 *       required: true
 *     - in: path
 *       name: todo_id
 *       description: 수정할 할 일 아이디
 *       schema:
 *        type: string
 *       required: true
 *       examples: 
 *        단수인 경우:
 *         value: 1
 *        복수인 경우:
 *         value: 1,2 (띄어쓰기 X)
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        oneOf:
 *         - $ref: '#/components/requestBodies/list_id'
 *         - $ref: '#/components/requestBodies/content'
 *       examples:
 *        리스트 변경인 경우:
 *         value:
 *          list_id: 1
 *        내용 변경인 경우:
 *         value:
 *          content: 새로운 할 일
 *        반영구 삭제인 경우:
 *         value:
 *          is_deleted: false
 */        
todoRouter.patch('/:todo_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // list_id or content or is_deleted in req.body
    const todos = req.params.todo_id.split(',').map(x => Number(x))
    if (req.body.content) {
      const data: {
        content: string
        id: number
      } = { content: req.body.content, id: todos[0] }
      const newTodoData = await todoModel.modifyTodo(data)
      if (newTodoData) {
        return res.status(200).json(newTodoData)
      } else {
        return res.status(400).json({ 'error_message': 'no updated todo item' })
      }
    } else if (req.body.list_id) {
      const data: {
        list_id: number
        id: number[]
      } = { list_id: req.body.list_id, id: todos }
      const newTodoData = await todoModel.modifyTodo(data)
      if (newTodoData) {
        return res.status(200).json(newTodoData)
      } else {
        return res.status(400).json({ 'error_message': 'no updated todo item' })
      }
    } else if (req.body.is_deleted === false) {
      const data: {
        is_deleted: boolean
        id: number[]
      } = { is_deleted: false, id: todos }
      const newTodoData = await todoModel.modifyTodo(data)
      if (newTodoData) {
        return res.status(200).json(newTodoData)
      } else {
        return res.status(400).json({ 'error_message': 'no updated todo item' })
      }
    } else {
      return res.status(404).json({ 'error_message': 'no data to update' })
    }

  } catch (err) {
    console.error(err)
    next(err)
  }
})

export default todoRouter