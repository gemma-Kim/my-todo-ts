import app from './app';
import * as dotenv from 'dotenv';
import { sequelize } from './models'

dotenv.config();

const prod: boolean = process.env.NODE_ENV === 'production';
const port = prod ? process.env.PORT : 3065

// database connection
sequelize.sync({ force: false })
  .then((): void => {
    console.log('Success to connect DB');
  })
  .catch((err: Error): void => {
    console.error(err);
  })

app.listen(port, (): void => {
  console.log(`Server is running on PORT ${port}`);
})

export {
  prod,
}