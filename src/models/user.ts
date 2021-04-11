import prisma from './index';
import * as bcrypt from 'bcrypt'

const createNewUser = async (email: string, password: string) => {
  const hashedPW = await bcrypt.hash(password, 12)
  return await prisma.users.create({
    data: {
      email: email,
      password: hashedPW,
      lists: {
        create: [
          { 'title': 'Basic' }
        ],
      }
    },
    include: {
      lists: true,
    },
  });
}

interface IinputUserData {
  id?: number | undefined
  email?: string | undefined
}
const findUniqueUser = (inputData: IinputUserData) => {
  const { id: inputId, email: inputEmail } = inputData;
  const user = prisma.users.findUnique({
    where: {
      id: inputId,
      email: inputEmail
    },
    select: { id: true },
  });
  if (user) {
    return user
  }
  return false
}

const deleteNewUser = (id: number) => {
  return prisma.users.delete({
    where: {
      id
    },
    select: { id: true }
  });
}

export {
  createNewUser,
  findUniqueUser,
  deleteNewUser
}
