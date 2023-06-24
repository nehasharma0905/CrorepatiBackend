import {connect} from 'mongoose'

export const db_connection =  async()=> {
    try {
        const connectionUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@crorepatidatabase.dfjgkev.mongodb.net/?retryWrites=true&w=majority`
        await connect(connectionUrl);
        
    } catch (error) {
        console.log("Error while DB connection",error)
    }
   

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}