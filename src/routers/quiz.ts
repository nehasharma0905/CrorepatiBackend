import express, { Request, Response } from 'express';
import questionJson from './../static/data/question.json';
import { generateQuiz } from '../services/quiz.services';

const quiz = express.Router({mergeParams: true});;


quiz.get("/getQuiz/:username", async (req:Request, res: Response)=>{
    const username: any = req.params.username
    console.log("data", username)
    const quizCreated = await generateQuiz(username);
    console.log("quizCreated", quizCreated)
    res.json({...quizCreated})
})


quiz.post("/useLifeLine", (req: Request, res: Response)=>{
    res.json({message:"lifeline used"})

})

quiz.get("/create2", (req: Request, res: Response)=>{
    res.send("Test")
})


module.exports = quiz;