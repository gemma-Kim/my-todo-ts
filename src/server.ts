import app from './app';
import prisma from './models';
import * as http from 'http';
import * as dotenv from 'dotenv';

dotenv.config();

const prod: boolean = process.env.NODE_ENV === 'production';
const port = prod ? process.env.PORT : 3065;
const server = http.createServer(app);

async () => {
  try {
    server.listen(port, (): void => {
      console.log(`Server is running on PORT ${port}`);
    })
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

export {
  prod,
}