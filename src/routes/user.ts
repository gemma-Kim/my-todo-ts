import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import prisma from '../models';
import { isLoggedIn, isNotLoggedIn } from './middleware';

const userRouter = Router();

// userRouter.get('/', isLoggedIn, (req, res) => {
//   const user = req
//   return res.json({ ...user, password: null });
// });

interface ISignupData {
  email: string,
  password: string,
  nickname: string
}

userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email: inputEmail, password: inputPW, nickname: inputNickname }: ISignupData = req.body;
    const user = await prisma.users.findUnique({
      where: {
        email: inputEmail,
      },
    });
    if (user) {
      return res.status(403).json( { 'message': '이미 존재하는 사용자입니다.' })
    }
    const hashedPW = await bcrypt.hash(inputPW, 12);
    const newUser = await prisma.users.create({
      data: {
        email: inputEmail,
        password: hashedPW,
      }
    });
    
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
        const userInfo = await prisma.users.findUnique({
          where: { id: user.id },
          select: { id: true },
        })
        
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

// userRouter.get('/:id', isLoggedIn, async (req, res, next) => {
//   try {
//     const userInfo = await User.findOne({
//       where: { id: req.params.id },
//       attributes: ['id', 'nickname'],
//       include: [{
//         model: Todo,
//         attributes: ['id', 'body'],
//         order: ['createdAt', 'DESC'],
//       }],
//     })
//     if (!userInfo) {
//       return res.status(404).send('no user');
//     }
//     const jsonUser = userInfo.toJSON() as User;
//     return res.json(jsonUser);
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// })

export default userRouter