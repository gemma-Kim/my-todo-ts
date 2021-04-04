import { Router } from 'express';
import userRouter from './user';
import todoRouter from './todo';
import listRouter from './todo';


const router = Router();

router.use('/user', userRouter);
router.use('/todo', todoRouter);
router.use('/list', listRouter);

export default router
