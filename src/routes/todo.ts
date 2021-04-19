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
 *   description: 새로운 todo 추가
 *   summary: 할 일 추가
 *   parameters:
 *    - in: cookie
 *      name: connect.sid
 *      schema:
 *       type: string
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:   
 *      schema:
 *       $ref: '#/components/requestBodies/todo'
 *   responses:
 *    201:
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
 *     description: 추가할 할 일의 content, list_id 값이 없음
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
            return res.status(201).json(newTodo)
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
 *    summary: 할 일 수정
 *    description: todo의 리스트, 내용, 삭제 여부를 수정. 내용 이외의 리스트, 삭제 여부는 여러 개를 한 꺼번에 수정 가능
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
 *    responses:
 *     204:
 *      description: 업데이트 성공
 *     400:
 *      description: 업데이트 된 정보 없음
 *      content:
 *       application/json:
 *        schema: 
 *         $ref: '#/components/responses/default'
 *        example:
 *         error_message: no updated todo item
 *     401:
 *      description: 인증되지 않은 사용자
 *      content:
 *       application/json:
 *        schema: 
 *         $ref: '#/components/responses/default'
 *        example:
 *         error_message: 로그인이 필요합니다.
 *     404:
 *      description: 업데이트할 정보 없음
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/responses/default'
 *        example:
 *         error_message: no data to update
 */        
todoRouter.patch('/:todo_id', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // list_id or content or is_deleted in req.body
    const todos = req.params.todo_id.split(',').map(x => Number(x))
    if (req.body.content) {
      const data: {
        content: string
      } = { content: req.body.content }
      const updatedData = await todoModel.modifyTodo(todos, data)
      if (updatedData && Number(updatedData.count) === todos.length) {
        return res.status(204).end()
      } else {
        return res.status(400).json({ 'error_message': 'no updated todo item' })
      }
    } else if (req.body.list_id) {
      const data: {
        list_id: number
      } = { list_id: req.body.list_id}
      const updatedData = await todoModel.modifyTodo(todos, data)
      if (updatedData && Number(updatedData.count) === todos.length) {
        return res.status(204).end()
      } else {
        return res.status(400).json({ 'error_message': 'no updated todo item' })
      }
    } else if (req.body.is_deleted === false) {
      const data: {
        is_deleted: boolean
      } = { is_deleted: false }
      const updatedData = await todoModel.modifyTodo(todos, data)
      if (updatedData && Number(updatedData.count) === todos.length) {
        return res.status(204).end()
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

/**
 * @swagger
 *  /todo:
 *   delete:
 *    summary: 할 일 영구 삭제
 *    description: 여러 할 일들을 영구히 삭제함
 *    tags:
 *     - Todo
 *    parameters:
 *     - in: cookie
 *       name: connect.sid
 *       summary: 사용자 인증 세션 아이디
 *       schema:
 *        type: string
 *       required: true
 *    requestBody:
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties: 
 *         todo_id:
 *          type: array
 *          items:
 *           type: integer
 *          example: [1, 2, 3]
 *    responses:
 *     204:
 *      description: 성공
 *     400:
 *      description: 삭제된 할 일 없음
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/responses/default'
 *        example:
 *         error_message: no deleted todo item
 *     401:
 *      description: 인증되지 않은 사용자
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/responses/default'
 *        example:
 *         error_message: 로그인이 필요합니다.
 *     404:
 *      description: 삭제 가능한 할 일 목록 없음
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/responses/default'
 *        example:
 *         error_message: no todo item to delete
 */
todoRouter.delete('', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.todo_id) {
      const result = await todoModel.deleteTodos(req.body.todo_id)
      if (result.count && Number(result.count) === req.body.todo_id.length) {
        return res.status(204).end()
      } else {
        return res.status(400).json({ 'error_message': 'no deleted todo item' })
      }
      
    } else {
      return res.status(400).json({ 'error_message': 'no todo item to delete' })
    }

  } catch (err) {
    console.error(err)
    next(err)
  }
})

export default todoRouter