import express, { Request, Response } from 'express';
import questionJson from './../static/data/question.json';
import { generateQuiz, markUserAnswer, requestLifeline } from '../services/quiz.services';

const quiz = express.Router({mergeParams: true});;


quiz.get("/getQuiz/:username", async (req:Request, res: Response)=>{
    const username: any = req.params.username
    console.log("data", username)
    const quizCreated = await generateQuiz(username);
    console.log("quizCreated", quizCreated)
    res.json({...quizCreated})
})


quiz.post("/useLifeLine", async(req: Request, res: Response) => {
    // GET QuizID, QuestionID, lifelineType
    const response = await requestLifeline(req.body);
    res.json(response)

})

quiz.post("/lockAnswer", async (req: Request, res: Response) => {
    // GET QuizID, QuestionID, AnswerID
    const resBody = { ...req.body };

    const response = await markUserAnswer(resBody);

    res.json({
       ...response
    })
})


module.exports = quiz;