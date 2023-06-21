import express, { Request, Response } from 'express';
import questionJson from './../static/data/question.json';

const quiz = express.Router({mergeParams: true});;


quiz.get("/getQuiz", (req:Request, res: Response)=>{
    const questionArray = [questionJson.question]
    res.json({quiz: questionArray})
})


quiz.post("/create", (req: Request, res: Response)=>{
    res.json({message:"created"})

})

quiz.get("/create2", (req: Request, res: Response)=>{
    res.send("Test")
})


module.exports = quiz;