import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import prisma, { userModel, todoModel } from '../models';
import { isLoggedIn, isNotLoggedIn } from './middleware';
// import { validUser } from '../validate'

const userRouter = Router();

// userRouter.get('/', isLoggedIn, (req, res) => {
//   const user = req
//   return res.json({ ...user, password: null });
// });

interface ISignupData {
  email: string,
  password: string,
}

userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.findUniqueUser(req.body)
    if (user) {
      return res.status(403).json({ 'message': '이미 존재하는 사용자 이메일 입니다.' })
    }
    // validate email, password 
    // code ----->
    const { email: inputEmail, password: inputPW }: ISignupData = req.body;
    const hashedPW = await bcrypt.hash(inputPW, 12);

    const newUser = await userModel.createNewUser(inputEmail, hashedPW);
    
    return res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

userRouter.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err: Error, user, info: { message: string }) => {
    if (err) {
      console.error(err);
      return next(err);
    };
    if (info) {
      return res.status(401).send(info.message);
    }
    return req.login(user, async (loginErr: Error) => {
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const userInfo = await userModel.findUniqueUser( { id: user.id } )

        return res.status(200).json( { ...userInfo, 'message': 'login success' })
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  })(req, res, next);
});

userRouter.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.send('success to logout');
  });
})

userRouter.get('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const paramsId = Number(req.params.id)
    const todoLists = await todoModel.getUserTodo(paramsId);
    return res.json(todoLists)
  } catch (err) {
    console.error(err);
    next(err);
  }
})

export default userRouter