import { Router, Request, Response, NextFunction } from 'express';
import prisma, { userModel, todoModel, listModel } from '../models';
import { isLoggedIn, isNotLoggedIn } from './middleware';
import { SignUpData } from '../validators/user'
import * as passport from 'passport';

const userRouter = Router();

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
          return res.status(200).json({ ...newUser, password: null })
        } else {
          return res.status(400).json({ 'message': '알 수 없는 이유로 회원가입이 불가합니다.'})
        }
      }
    }
  }
  catch (err) {
    console.error(err);
    next(err);
  }

});

userRouter.post('/login', isNotLoggedIn, (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error, user, info: { message: string }) => {
    if (info) {
      return res.status(401).json(info.message);
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
        const userInfo = await userModel.findUniqueUser( { id: user.id } )

        return res.status(200).json(userInfo)
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  })(req, res, next);
});

// logout
userRouter.post('/logout', isLoggedIn, (req: Request, res: Response, next: NextFunction) => {
  req.logout();
  req.session.destroy(() => {
    res.status(200).json('success to logout');
  });
})



export default userRouter
