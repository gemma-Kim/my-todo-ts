import { Router, Request, Response, NextFunction } from 'express';
import { userModel, todoModel, listModel } from '../models';
import { isLoggedIn, isNotLoggedIn } from './middleware';
import * as passport from 'passport';

const userRouter = Router();

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
    const { email: inputEmail, password: inputPW }: ISignupData = req.body;
    
    class UserData {
      constructor(
        readonly email: string, 
        readonly pw: string,
      ){}
      public signup_isvalid(): object {
        const email_validator = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
        if (email_validator.test(this.email) === false) {    
          return res.status(400).json({ 'message': '이메일 형식이 올바르지 않습니다.'})
        }
        if (this.pw.length < 8) {
          return res.status(400).json({ 'message': '패스워드는 8자 이상이어야 합니다.'})
        }
        return { email: this.email, password: this.pw }
      }
    }
    const userData: UserData = new UserData(inputEmail, inputPW)
    userData.signup_isvalid();
    const newUser = await userModel.createNewUser(userData.email, userData.pw);
    const listId = await listModel.addList(newUser.id, 'Basic', true);
    return res.status(200).json( { user_id: newUser.id, list_id: listId.id } );
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

        return res.status(200).json(userInfo)
      } catch (err) {
        console.error(err);
        next(err);
      }
    });
  })(req, res, next);
});

// logout
userRouter.post('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.status(200).json('success to logout');
  });
})

// get user todos 
userRouter.get('/:user_id/todos', isLoggedIn, async (req, res, next) => {
  try {
    
  } catch (err) {
    console.error(err);
    next(err);
  }
})

export default userRouter