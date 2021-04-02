import { Router } from 'express'
import prisma from '../models'

const listRouter = Router();

// 리스트 추가
const addList = (userId: number, title: string) => {
  return prisma.lists.create({
    data: {
      user_id: userId,
      title: title,
    }
  })
}

export {
  addList
}