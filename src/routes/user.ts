
import * as passport from 'passport';
import { Router, Request, Response, NextFunction } from 'express';
import { isLoggedIn, isNotLoggedIn } from './middleware';
import { userModel, todoModel } from '../models';
import { SignUpData } from '../validators/user'
import { InferencePriority } from 'typescript';

const userRouter = Router();

/**
 * @swagger
 * components:
 *  responses:
 *   default:
 *    type: object
 *    properties:
 *     error_message:
 *      type: string
 *   signup_success:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      example: 1
 *     email:
 *      type: string
 *      example: test@gmail.com
 *     password:
 *      type: string
 *      nullable: true
 *      example: null
 *     created_at:
 *      type: string
 *      example: 2021-04-15T08:51:29.000Z
 *     updated_at:
 *      type: string
 *      nullable: true
 *      example: null
 *     lists:
 *      type: array
 *      items: 
 *       oneOf:
 *        - $ref: '#/components/schemas/List'
 *   login_success:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: 사용자 id
 *      example: 1
 *     password:
 *      type: string
 *      description: 항상 null
 *      example: null
 *   get_user_success:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      example: 1
 *      description: 사용자 id
 *     lists:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        id:
 *         type: integer
 *         description: list id
 *        title:
 *         type: string
 *         description: list title
 *      example:
 *       - id: 1
 *         title: Basic
 *       - id: 2
 *         title: Study
 *     todos: 
 *      type: array
 *      items:
 *       type: object
 *       properties: 
 *        id: 
 *         type: integer
 *         description: todo id
 *         example: 1
 *        list_id:
 *         type: integer
 *         description: list id of the todo
 *         example: 1
 *        content:
 *         type: string
 *         description: content of the todo
 *         example: content
 *      example:
 *        - id: 1
 *          list_id: 1
 *          content: content 1
 *        - id: 2
 *          list_id: 1
 *          content: content 2
 *        - id: 3
 *          list_id: 1
 *          content: content 3
 *   add_todo_success:
 *    type: object
 *    properties:
 *     id: 
 *      type: integer
 *      
 * 
 *  requestBodies:
 *   user:
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      required: true
 *     password:
 *      type: string
 *      required: true
 *    example:
 *     email: test@gmail.com
 *     password: "12345678"
 *   todo:
 *    type: object
 *    properties:
 *     list_id:
 *      type: integer
 *      required: true
 *     content:
 *      type: string
 *      required: true
 *    example:
 *     list_id: 1
 *     content: 운동하기
 * 
 *  schemas:
 *   List:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      example: 1
 *     user_id:
 *      type: integer
 *      example: 1
 *     title:
 *      type: string
 *      example: Basic
 *     default:
 *      type: boolean
 *      example: true
 *     is_deleted:
 *      type: boolean
 *      example: false
 *     created_at:
 *      type: string
 *      example: 2021-04-15T08:51:29.000Z
 *     updated_at:
 *      type: string
 *      example: null
 * 
 */


/**
 * @swagger 
 * /user/signup:
 *   post:
 *    tags: 
 *     - User
 *    summary: 회원가입
 *    requestBody:
 *     description: 회원가입
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/requestBodies/user'
 *    responses:
 *     201:
 *      description: 회원가입 성공
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/responses/signup_success'     
 *     400:
 *      description: 잘못된 요청 값
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/responses/default'
 *        examples:
 *         이메일 형식 오류:
 *          value:
 *           error_message: 이메일 형식이 올바르지 않습니다.
 *         비밀번호 형식 오류:
 *          value:
 *           error_message: 비밀번호는 8자 이상이어야 합니다.
 *         잘못된 요청:
 *          value:
 *           error_message: 잘못된 요청입니다.
 *     403: 
 *       description: 존재하는 사용자
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/responses/default'
 *         example:
 *          error_message: 존재하는 사용자 입니다. 
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {    
      const signupData = new SignUpData(req.body).isvalid()
      if (!signupData.result) {
        return res.status(signupData.status).json({ 'message': signupData.error_message })
      } else {
        if (await userModel.findUniqueUser(req.body)) {
          return res.status(403).json({ 'error_message': '존재하는 사용자 입니다.' })
        } else {
          const newUser = await userModel.createNewUser(req.body.email, req.body.password);
          if (newUser) {
            return res.status(201).json({ ...newUser, password: null })
          } else {
            return res.status(400).json({ 'error_message': '잘못된 요청입니다.' })
          }
        }
      }
    }
    catch (err) {
      console.error(err);
      next(err);
    }
  
  });

/**
 * @swagger
 * /user/login:
 *  post:
 *   tags: 
 *    - User
 *   description: 로그인
 *   summary: 로그인 & 인증 세션 발급
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/requestBodies/user'
 *   responses:
 *    200:
 *     description: 로그인 성공
 *     headers:
 *      Set-Cookie:
 *       schema:
 *        type: string
 *        example: connect.sid=s%3AisbSjtZ7sE0avgRiKcgHm-vbUTOivbPZ.gApy0CtBLxVoBKVsVngYl1Qm42Tp08J5OdpVhZQ6usQ; Path=/; HttpOnly
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/login_success'    
 *    400:
 *     description: 잘못된 요청
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/default'
 *       examples:
 *        비밀번호 틀림:
 *         value:
 *          error_message: 비밀번호가 잘못되었습니다.
 *        잘못된 요청:
 *         description: 이메일, 비밀번호 값이 없는 경우
 *         value:
 *          error_message: key_error
 *    403:
 *     description: 인증된 사용자
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/default'
 *       example:
 *        error_message: 로그인한 사용자는 접근할 수 없습니다.    
 *    404:
 *     description: 존재하지 않는 사용자
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/default'
 *       example:
 *        error_message: 존재하지 않는 사용자입니다.
 */
 userRouter.post('/login', isNotLoggedIn, (req: Request, res: Response, next: NextFunction) => {
  if (req.body.email && req.body.password) {
    passport.authenticate('local', (err: Error, user, info: { message: string }) => {
      if (info) {
        if (info.message === "존재하지 않는 사용자입니다.") {
          return res.status(404).json(info)
        } else {
          return res.status(400).json(info)
        }
      }
      if (err) {
        console.error(err);
        return next(err);
      }
      return req.login(user, async (loginErr: Error) => {
        try {
          if (loginErr) {
            return next(loginErr);
          } else {
            return res.status(200).json({ ...user, password: null })
          }
        } catch (err) {
          console.error(err);
          next(err);
        }
      });
    })(req, res, next);
  } else {
    return res.status(400).json({ 'error_message': 'key_error' })
  }
});

/**
 * @swagger
 * /user/logout:
 *  post:
 *   tags:
 *    - User
 *   description: 로그아웃
 *   summary: 인증 세션 삭제
 *   parameters:
 *    - in: cookie
 *      name: connect.sid
 *      schema:
 *       type: string
 *   responses:
 *    200:
 *     description: 로그아웃 성공
 *    401:
 *     description: 인증되지 않은 사용자
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/responses/default'
 *       example:
 *        error_message: 로그인이 필요합니다.
 */
userRouter.post('/logout', isLoggedIn, (req: Request, res: Response, next: NextFunction) => {
  req.logout();
  req.session.destroy(() => {
    return res.status(200).end();
  });
})


/**
 * @swagger
 * /user/{user_id}?:
 *  get:
 *   tags:
 *    - User
 *   description: 기본 Todo & List 정보 조회
 *   parameters:
 *    - in: cookie
 *      name: connect.sid
 *      schema:
 *       type: string
 *    - in: path
 *      name: user_id
 *      required: true
 *      schema:
 *       type: integer
 *    - in: query
 *      name: offset
 *      required: true
 *      schema:
 *       type: integer
 *    - in: query
 *      name: limit
 *      required: true
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: 조회 성공
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/get_user_success'
 *    400:
 *     description: 잘못된 요청
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/default'
 *       examples:
 *        비밀번호 틀림:
 *         description: offset, limit 파라미터 값이 없는 경우
 *         value:
 *          error_message: limit should be greater than offset
 *        잘못된 요청:
 *         description: 파라미터가 전달되지 않은 경우
 *         value:
 *          error_message: 잘못된 요청입니다.
 *    401:
 *     description: 인증되지 않은 사용자
 *     content:
 *      application/json:
 *       schema: 
 *        $ref: '#/components/responses/default'
 *       example:
 *        error_message: 로그인이 필요합니다.
 *    403:
 *     description: 로그인 한 사용자와 parameter user_id가 같지 않은 경우
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/responses/default'
 *       example:
 *        error_message: 다른 사용자의 정보에 접근할 수 없습니다.
 *    404:
 *     description: 존재하지 않은 사용자 정보에 접근하는 경우
 *     content:
 *      application/json:
 *       schema: 
 *        $ref: '#/components/responses/default'
 *       example:
 *        error_message: 해당 사용자는 존재하지 않는 사용자입니다.
 * */
userRouter.get('/:user_id', isLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      if (req.user.id === Number(req.params.user_id)) {
        if (req.query.offset && req.query.limit) {
          if (req.query.offset >= req.query.limit) {
            return res.status(400).json({ 'error_message': 'limit should be greater than offset' })
          } else {
            const user = await userModel.findUniqueUser({ id: req.user.id })
            if (!user) {
              return res.status(404).json({ 'error_message': '해당 사용자는 존재하지 않는 사용자입니다.' })
            } else {
              const todoData = await todoModel.getUserTodo(Number(req.user.id), Number(req.query.offset), Number(req.query.limit))
              return res.status(200).json(todoData[0])
            }
          }
        } else {
          return res.status(400).json({ 'error_message': '잘못된 요청입니다.'})
        }
      } else {
        return res.status(403).json({ 'error_message': '다른 사용자의 정보에 접근할 수 없습니다.'})
      }
    } else {
      return res.status(400).json({ 'error_message': '잘못된 요청입니다.'})
    }
    
  } catch (err) {
    console.error(err);
    next(err);
  }
})

export default userRouter
