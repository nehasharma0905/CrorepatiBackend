import express, { Request, Response } from 'express';
import questionJson from './../static/data/question.json';

const questions = express.Router({mergeParams: true});;


questions.get("/getQuestion/:questionId", (req:Request, res: Response)=>{
    const questionId: any = req.params.questionId
    console.log("questionId", questionId)
    const questionData = questionJson.question.filter((el)=>el.id === questionId);
    res.json({questions: questionData})
})


questions.get("/create", (req: Request, res: Response)=>{
    res.json({message:"created"})

})

questions.get("/create2", (req: Request, res: Response)=>{
    res.send("Test")
})


module.exports = questions;