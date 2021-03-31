import { Router } from 'express';
import userRouter from './user';
import todoRouter from './todo';

const router = Router();

router.use('/users', userRouter);
router.use('/todos', todoRouter);

export default router
