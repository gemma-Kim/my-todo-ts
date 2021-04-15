
import * as passport from 'passport';import { Router, Request, Response, NextFunction } from 'express';
import { isLoggedIn, isNotLoggedIn } from './middleware';
import { userModel } from '../models';
import { SignUpData } from '../validators/user'
import { InferencePriority } from 'typescript';

const userRouter = Router();

/**
 * @swagger
 * /user/signup:
 *   post:
 *    description: 회원가입
 *    parameters:
 *      - in: body
 *        type: object
 *        description: to create a new user
 *        schema:
 *          $ref: '#/components/schemas/User'
 *    responses:
 *     201:
 *      description: Created User
 *      schema:
 *       $ref: '#/components/schemas/Signup_Success'
 *     400:
 *      description: 이메일 형식 오류
 *      schema:
 *       $ref: '#/components/schemas/Error400'       
 *     403: 
 *       description: The user does already exist
 *       schema:
 *        $ref: '#/components/schemas/Error403'
 *     401:
 *      description: Invalid Email or Password
 *      schema:
 *        $ref: '#/components/schemas/Error401'
 *      examples:
 *       objectExample:
 *         $ref: '#/components/examples/objectExample'
 * 
 * components: 
 *  examples:
 *   objectExample:
 *     value:
 *       id: 1
 *       name: new object
 *     summary: A sample object
 * 
 *  schemas:
 *   User:
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
 * 
 *   List:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *     user_id:
 *      type: integer
 *     title:
 *      type: integer
 *     default:
 *      type: boolean
 *     is_deleted:
 *      type: boolean
 *     created_at:
 *      type: string
 *     updated_at:
 *      nullable: true
 *   example:
 *    id: 1
 *    user_id: 1
 *    title: Basic
 *    default: true
 *    is_deleted: false
 *    created_at: 2021-04-15T08:51:29.000Z
 *    updated_at: null
 * 
 *   Signup_Success:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *     email:
 *      type: string
 *     password:
 *      type: string
 *      nullable: true
 *     created_at:
 *      type: string
 *     updated_at:
 *      type: string
 *      nullable: true
 *     lists:
 *      type: array
 *      items: 
 *       oneOf:
 *        - $ref: '#/components/schemas/List'
 *    example:
 *     id: 1
 *     email: test@gmail.com
 *     password: null
 *     created_at: 2021-04-15T08:51:29.000Z
 *     updated_at: null
 *     lists:
 *       - id: 1
 *         user_id: 1
 *         title: Basic
 *         default: true
 *         is_deleted: false
 *         created_at: 2021-04-15T08:51:29.000Z
 *         updated_at: null
 * 
 *   Error401:
 *    type: object
 *    properties:
 *     message:
 *      type: string
 *      required: true
 * 
 *   Error403:
 *    type: object
 *    properties:
 *     message:
 *      type: string
 *    example:
 *     message: '이미 존재하는 사용자 이메일 입니다.'
 * 
 *   Error400:
 *    type: object
 *    properties:
 *     message:
 *      type: string
 *      example: 아년
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {    
      const signupData = new SignUpData(req.body).isvalid()
      if (!signupData.result) {
        return res.status(signupData.status).json({ 'message': signupData.message })
      } else {
        if (await userModel.findUniqueUser(req.body)) {
          return res.status(403).json({ 'message': '이미 존재하는 사용자 이메일 입니다.' })
        } else {
          const newUser = await userModel.createNewUser(req.body.email, req.body.password);
          if (newUser) {
            return res.status(201).json({ ...newUser, password: null })
          } else {
            return res.status(400).json({ 'message': '알 수 없는 이유로 회원가입이 불가합니다.' })
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
 *   description: 로그인
 *   summary: 로그인 & 인증 쿠키 발급
 *   requestBody:
 *    required: true
 *    description: A JSON object containing the login and password.
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/Login_Success'
 *   parameters:
 *    - in: body
 *      type: object
 *      schema:
 *       $ref: '#/components/schemas/User'
 *   responses:
 *    200:
 *     description: Success
 *     schema:
 *      $ref: '#/components/schemas/Login_Success'
 *    400:
 *     description: Bad Request
 *     schema:
 *      $ref: '#/components/schemas/Error401'
 * 
 * components:
 *  schemas:
 *   Login_Success:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: User ID
 */
 userRouter.post('/login', isNotLoggedIn, (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error, user, info: { message: string }) => {
    if (info) {
      console.log('0000')
        return res.status(400).json(info)
    }
    if (err) {
      console.error(err);
      return next(err);
    }
    return req.login(user, async (loginErr: Error) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        return res.status(200).json({ ...user, password: null })
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  })(req, res, next);
});

/**
 * @swagger
 * /user/logout:
 *  post:
 *   description: 로그인
 *   parameters:
 *    - in: body
 *      type: object
 *      schema:
 *       $ref: '#/components/schemas/User'
 *   responses:
 *    200:
 *     description: Success
 *     schema:
 *      $ref: '#/components/schemas/Logout_Success'
 *    400:
 *     description: Bad Request
 *     schema:
 *      $ref: '#/components/schemas/Error'
 * 
 * components:
 *  schemas:
 *   Logout_Success:
 *    type: object
 *    properties:
 *     id:
 *      type: integer
 *      description: User ID
 */
userRouter.post('/logout', isLoggedIn, (req: Request, res: Response, next: NextFunction) => {
  req.logout();
  req.session.destroy(() => {
    res.status(200).json('success to logout');
  });
})

export default userRouter
