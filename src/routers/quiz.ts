import express, { Request, Response } from 'express';
import questionJson from './../static/data/question.json';
import { generateQuiz, markUserAnswer } from '../services/quiz.services';

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

quiz.post("/lockAnswer", async (req: Request, res: Response) => {
    // GET QuizID, QuestionID, AnswerID
    const resBody = { ...req.body };

    const response = await markUserAnswer(resBody);
    
    res.json({
        isAnswerCorrect: false 
    })
})


module.exports = quiz;