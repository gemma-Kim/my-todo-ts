import { Router } from 'express';
import userRouter from './user';
import todoRouter from './todo';
import listRouter from './todo';


const router = Router();

router.use('/users', userRouter);
router.use('/todos', todoRouter);
router.use('/lists', listRouter);

export default router
