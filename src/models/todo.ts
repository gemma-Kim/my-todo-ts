import prisma from './index';

interface IinputTodoData {
  user_id: number
  list_id: number
  content: string
}
const addTodo = (data: IinputTodoData) => {
  return prisma.todos.create({
    data,
    select: {
      id: true,
      list_id: true,
      user_id: true,
      content: true,
    }
  })
}

const getUserTodo = async (id: number, offset: number, limit: number) => {
  return prisma.users.findMany({
    where: {
      id
    },
    select: {
      id: true,
      lists: {
        select: {
          id: true,
          title: true,
        }
      },
      todos: {
        select: {
          id: true,
          list_id: true,
          content: true,
        },
        where: {
          is_deleted: false,
          lists: {
            default: true
          }
        },
        orderBy: {
          created_at: 'desc',
        }
        
      }
    },     
  })
}

interface IModifyTodoData {
  id: number
  list_id?: number 
  content?: string
  is_deleted?: boolean
}
const modifyTodo = (data: IModifyTodoData) => {
  try {
    const { id } = data
    return prisma.todos.update({
      where: {
        id,
      },
      data: {
        ...data,
        updated_at: new Date()
      },
      select: {
        id: true,
        content: ("content" in data ? true : false),
        list_id: ("list_id" in data ? true : false),
      }
    })

  } catch (err) {
    console.error(err)
  }
}

const deleteTodos = (todoIds: number[], is_deleted: boolean) => {
  // it's already removed
  if (is_deleted) {
    return prisma.todos.deleteMany({
      where: {
        id: { in: todoIds },
      },
    })
  } else {
    // remove them
    return prisma.todos.updateMany({
      where: {
        id: { in: todoIds },
      },
      data: {
        is_deleted: true
      }
    })
  }
  
}

export {
  addTodo,
  getUserTodo,
  modifyTodo,
  deleteTodos,
}