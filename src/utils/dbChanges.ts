import { generateCollection } from '../models';
import { db_connection } from '../config/connections';


db_connection().then(()=>{
    generateCollection();
});