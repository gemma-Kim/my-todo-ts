import app from './app';
import * as dotenv from 'dotenv';
import * as http from 'http';

dotenv.config();

const prod: boolean = process.env.NODE_ENV === 'production';
const port = prod ? process.env.PORT : 3065
const server = http.createServer(app)

server.listen(port, (): void => {
  console.log(`Server is running on PORT ${port}`);
})

export {
  prod,
}