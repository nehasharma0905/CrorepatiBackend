import express, { Request, Response } from 'express';
import questionJson from './../static/data/question.json';

const questions = express.Router({mergeParams: true});;


questions.get("/:questionId", (req:Request, res: Response)=>{
    const questionId: any = req.params.questionId
    console.log("questionId", questionId)
    const questionData = questionJson.question.filter((el)=>el.id === questionId);
    res.json({questions: questionData})
})


questions.post("/:questionId/lockAnswer", (req: Request, res: Response)=>{
    res.json({
        isAnswerCorrect: false 
    })
})


module.exports = questions;