import { v4 as uuidv4 } from 'uuid';
import { QuestionModel, QuizModel } from "../models";

interface Question {
    question: string,
    options: Array<string>,
    correct: any,
    explanation: string,
    hint: string,
    difficulty: string
}

interface apiResponseInterface{
        status: boolean,
        message: string,
        error: any,
        data: any
    }


export const createQuestionsbyArray = async (data: Array<Question>) : Promise<any> => {
    const apiRes: apiResponseInterface = {
        status: false,
        message: '',
        error: null,
        data: null
    }
    try {
        const temp = data.map((el, index)=>{
            const question = {
                question: el.question,
                options: el.options.map((el, index)=>{
                    return {
                        id: uuidv4(),
                        text: el
                    }
                }),
                correct: el.correct,
                explanation: el.explanation,
                hint: el.hint,
                difficulty: el.difficulty
            }

            question.correct = question.options.filter((el)=>el.text === question.correct)[0];
            return question;
        })

        const db_res = await QuestionModel.insertMany(temp);
        console.log("question created", db_res);
        apiRes.status = true;
        apiRes.message = 'question created successfully';
        return apiRes;
     } catch (error:any) {
        console.log("error", error);
        apiRes.message = error.message;
        apiRes.error = error;
        return apiRes;
        }
}



export const addQuestion = async (data: Question) : Promise<any> => {
    const apiRes: apiResponseInterface = {
        status: false,
        message: '',
        error: null,
        data: null
    }
    try {

        const temp = data.options.map((el, index)=>{
            return {
                id: uuidv4(),
                text: el
            }
        })
        const correct = temp.filter((el)=>el.text === data.correct)[0];

     const question = new QuestionModel({
        question: data.question,
        options: temp,
        correct: correct,
        explanation: data.explanation,
        hint: data.hint,
        difficulty: data.difficulty
     }) 

     const db_res = await question.save();
     console.log("question created", db_res);
        apiRes.status = true;
        apiRes.message = 'question created successfully';
        return apiRes;
     } catch (error:any) {
        console.log("error", error);
        apiRes.message = error.message;
        apiRes.error = error;
        return apiRes;
        }
        
}




export const getQuestionById = async (id: string) : Promise<any> => {
    const apiRes : apiResponseInterface = {
        status: false,
        message: '',
        error: null,
        data: null
    }
    try {
        const db_res = await QuestionModel.findById(id);
        apiRes.status = true;
        apiRes.message = 'question found successfully';
        const temp:any = {...db_res}
        const questionData = temp["_doc"];
        apiRes.data = {
            question: questionData.question,
            options: questionData.options,
        };
        return apiRes;
     } catch (error:any) {
        console.log("error", error);
        apiRes.message = error.message;
        apiRes.error = error;
        return apiRes;
        }
        
}
