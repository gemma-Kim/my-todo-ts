import { PrismaClient } from '@prisma/client';
import * as userModel from './user';
import * as todoModel from './todo';
import * as listModel from './list';

const prisma = new PrismaClient();

export default prisma
export {
  userModel,
  todoModel,
  listModel,
}