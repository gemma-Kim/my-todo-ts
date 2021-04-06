import { Router } from 'express'
import prisma from '../models'

const listRouter = Router();

// get list
const getUserList = (user_id: number) => {
  
}

// add new list
const addList = async (user_id: number, title: string, basic: boolean) => {
  if (basic) {
    return await prisma.lists.create({
      data: {
        user_id,
        title,
        default: basic,
      },
      select: { id: true }
    })
  }
}

// delete list
const deleteList = (user_id: number, list_id: number) => {
  return prisma.lists.delete
}

export {
  addList,
  getUserList,
}
