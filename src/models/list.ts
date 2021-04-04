import { Router } from 'express'
import prisma from '../models'

const listRouter = Router();

// 
const userDefaultList = (userId: number) => {
  return prisma.todo_lists.findMany({
    where: {
      id: userId
    },
    include: {
      lists: true
    }
  })
}
// 리스트 추가
const addList = (userId: number, title: string, basic?: boolean | undefined) => {
  if (basic) {
    return prisma.lists.create({
      data: {
        user_id: userId,
        title: title,
        default: true
      },
      select: { id: true }
    })
  }
  return prisma.lists.create({
    data: {
      user_id: userId,
      title: title,
    },
    select: { id: true }
  })
}

const deleteList = (userId: number, listId: number) => {
  return prisma.lists.delete
}

export {
  addList,
  userDefaultList
}