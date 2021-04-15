import prisma from './index';
import * as bcrypt from 'bcrypt'

const createNewUser = async (email: string, password: string) => {
  if (email && password) {
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
      }
    });
  } else {
    return false
  }
}

interface IinputUserData {
    id?: number | undefined
    email?: string | undefined
  }
const findUniqueUser = (inputData: IinputUserData) => {
  const { id: inputId, email: inputEmail } = inputData;
  if (!inputId && !inputEmail) {
    return false
  } else {
    const user = prisma.users.findUnique({
      where: {
        id: inputId,
        email: inputEmail
      },
      select: {
        id: true,
        password: true
      },
    });
   return user
  }
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