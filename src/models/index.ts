import mongoose from "mongoose";

import { userSchema } from "../schema/user.schema"
import { questionSchema } from "../schema/question.schema";
import { quizSchema } from "../schema/quiz.schema";



export const UserModel = mongoose.model('User', userSchema);
export const QuestionModel = mongoose.model('Questions', questionSchema);
export const QuizModel = mongoose.model('Quiz', quizSchema);


export const generateCollection = () => {
QuestionModel.createCollection().then((res)=>console.log("DB MODEL RES", res));
QuizModel.createCollection().then((res)=>console.log("DB MODEL RES", res));
}

