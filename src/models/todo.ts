import prisma from './index';


interface IinputTodoData {
  userId: number
  listId: number
  content: string
}
const addTodo = (inputData: IinputTodoData) => {
  const { userId, listId, content } = inputData
  return prisma.todo_lists.create({
    data: {
      user_id: userId,
      list_id: listId,
      content: content,
    },
    select: {
      id: true,
      list_id: true,
      user_id: true,
      content: true,
    }
  })
}

const getUserTodo = async (userId: number) => {
  return prisma.todo_lists.findMany({
    where: { 
      user_id: userId,
      is_deleted: false,
    },
    select: {
      id: true,
      content: true,
    }
  })
}

interface IModifyTodoData {
  id: number
  list_id?: number 
  content?: string
}
const modifyTodo = (inputData: IModifyTodoData) => {
  try {
    const { id } = inputData
    return prisma.todo_lists.update({
      where: {
        id,
      },
      data: {
        ...inputData,
        updated_at: new Date()
      },
      select: {
        content: ("content" in inputData ? true : false),
        list_id: ("list_id" in inputData ? true : false),
      }
    })
  } catch (err) {
    
  }
}

const deleteTodos = (todoIds: number[], is_deleted: boolean) => {
  // it's already removed
  if (is_deleted) {
    return prisma.todo_lists.deleteMany({
      where: {
        id: { in: todoIds },
        is_deleted
      },
    })
  }
  // remove them
  return prisma.todo_lists.updateMany({
    where: {
      id: { in: todoIds },
      is_deleted
    },
    data: {
      is_deleted: is_deleted ? false : true
    }
  })
}

export {
  getUserTodo,
  addTodo,
  modifyTodo,
  deleteTodos,
}