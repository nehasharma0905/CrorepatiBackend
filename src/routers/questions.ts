import express, { Request, Response } from 'express';
import questionJson from './../static/data/question.json';
import { addQuestion, createQuestionsbyArray, getQuestionById } from '../services/question.services';

const questions = express.Router({mergeParams: true});;


questions.get("/:questionId", async (req:Request, res: Response)=>{
    const questionId: any = req.params.questionId
    console.log("questionId", questionId)
    const questionData = await getQuestionById(questionId);
    res.json(questionData)
})


questions.post("/:questionId/lockAnswer", (req: Request, res: Response)=>{
    res.json({
        isAnswerCorrect: false 
    })
})

questions.post("/create", async (req: Request, res: Response)=>{
    const data = {...req.body};
    console.log("data", data)
    const questionCreated = await addQuestion(data);
    res.json({...questionCreated})
})

questions.post("/createbyArray", async (req: Request, res: Response)=>{
    const data = {...req.body};
    console.log("data", data)
    const questionCreated = await createQuestionsbyArray(data.questions);
    res.json({...questionCreated})
})




module.exports = questions;