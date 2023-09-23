import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { db_connection } from './config/connections';
import { generateCollection } from './models';
import bodyParser from 'body-parser';
const routers = require("./routers");
const cors = require('cors')


dotenv.config();
db_connection().then(()=>{
  // generateCollection();
  console.log("Database is up and running!")
});

const app: Express = express();
const port = process.env.PORT;
app.use(cors({
  origin: "*"
}))
app.use(bodyParser.json())


app.use('/v1', routers);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});