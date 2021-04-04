import { Router } from 'express'
import prisma from '../models'

const listRouter = Router();

// get list
const getUserList = (user_id: number) => {
  
}

// add new list
const addList = (user_id: number, title: string, basic?: boolean | undefined) => {
  if (basic) {
    return prisma.lists.create({
      data: {
        user_id,
        title,
        default: true
      },
      select: { id: true }
    })
  }
  return prisma.lists.create({
    data: {
      user_id,
      title,
    },
    select: { id: true }
  })
}

const deleteList = (user_id: number, list_id: number) => {
  return prisma.lists.delete
}

export {
  addList,
  getUserList,
  // userDefaultList
}