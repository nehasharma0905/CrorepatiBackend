import mongoose from "mongoose";

import { userSchema } from "../schema/user.schema"



export const UserModel = mongoose.model('User', userSchema);


export const generateCollection = () => {
UserModel.createCollection().then((res)=>console.log("DB MODEL RES", res));
}

