import { Router } from 'express';
import prisma from '../models';

const todoRouter = Router();

// Create
// todoRouter.post('', (req, res, next) => {
//   prisma.todo_lists.create({

//   })
// })

export default todoRouter;