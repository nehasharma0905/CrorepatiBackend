import { questionSchema } from './../schema/question.schema';
import { v4 as uuidv4 } from "uuid";
import { QuestionModel, QuizModel } from "../models";
import { userQuizQuestionSchema } from "./../schema/quiz.schema";

const lifeLineArray = [
  {
    title: "50-50",
    used: false,
  },
  {
    title: "Exchange Question",
    used: false,
  },
  {
    title: "Ask the Expert",
    used: false,
  },
  {
    title: "Audience Poll",
    used: false,
  },
];

const getDifficulty = (difficultyArray: number[]): any => {
  let easy = difficultyArray[0];
  let medium = difficultyArray[2];
  let hard = difficultyArray[1];
  let difficulty = "";
  if (easy > 0) {
    difficultyArray[0] = difficultyArray[0] - 1;
    difficulty = "easy";
  } else if (medium > 0) {
    difficultyArray[2] = difficultyArray[2] - 1;
    difficulty = "medium";
  } else if (hard > 0) {
    difficultyArray[1] = difficultyArray[1] - 1;
    difficulty = "hard";
  }

  return {
    difficultyArray,
    difficulty,
  };
};

export const generateQuiz = async (username: string): Promise<any> => {
  let apiRes = {
    status: false,
    message: "",
    error: null,
    data: {},
  };
  try {
    let questionArray: any[] = [];
    let sum = 16;
    let numbers = [];
    for (let i = 0; i < 2; i++) {
      const randomNumber = Math.floor(Math.random() * sum);
      sum -= randomNumber < 0 ? 0 : randomNumber;
      numbers.push(randomNumber < 0 ? 0 : randomNumber);
    }
    numbers.push(sum);
    numbers.sort((a, b) => a - b);

    const randomEasy = await QuestionModel.aggregate([
      { $match: { difficulty: "easy" } },
      { $sample: { size: numbers[0] } },
    ]);

    questionArray = [
      ...questionArray,
      ...randomEasy.map((el, index) => {
        return el._id;
      }),
    ];

    const randomMedium = await QuestionModel.aggregate([
      { $match: { difficulty: "easy" } },
      { $sample: { size: numbers[2] } },
    ]);

    questionArray = [
      ...questionArray,
      ...randomMedium.map((el, index) => {
        return el._id;
      }),
    ];

    const randomHard = await QuestionModel.aggregate([
      { $match: { difficulty: "easy" } },
      { $sample: { size: numbers[1] } },
    ]);

    questionArray = [
      ...questionArray,
      ...randomHard.map((el, index) => {
        return el._id;
      }),
    ];

    const finalQuestionArray: any = questionArray.map((el, index) => {
      return {
        questionId: el,
        lockedAnswer: null,
        correct: null,
        usedLifeLine: null,
        earnedScore: null,
      };
    });

    const quiz = new QuizModel({
      quizId: uuidv4(),
      username: username,
      questions: finalQuestionArray,
      score: 0,
      lifelines: lifeLineArray,
    });

    const db_res = await quiz.save();
    console.log("quiz created", db_res);
    apiRes.status = true;
    apiRes.message = "quiz created successfully";
    apiRes.data = quiz;
    return apiRes;
  } catch (error: any) {
    console.log("error", error);
    apiRes.message = error.message;
    apiRes.error = error;
    return apiRes;
  }
};


export const markUserAnswer = async (data: any): Promise<any> => {
    const apiRes: any = {
        status: false,
        message: "",
        error: null,
        data: {},
    };
    try {
        const getQuiz = await QuizModel.findOne({ quizId: data.quizId });
        const questionSource = await QuestionModel.findOne({ questionId: data.questionId });
        if (getQuiz) {
            const quizQuestion = getQuiz.questions.find(
                (el: any, index: number) => el.questionId == data.questionId
            );
            if (quizQuestion && questionSource) {
                quizQuestion.lockedAnswer = data.answer;
                if(data.answer.id === questionSource.correct.id){
                    quizQuestion.correct = true;
                    quizQuestion.earnedScore = data.earnedScore;
                }
                else {
                    quizQuestion.correct = false;
                }
                const db_res = await getQuiz.save();
                console.log("question updated", db_res);
                apiRes.status = true;
                apiRes.message = "question updated successfully";
                apiRes.data = db_res;
                return apiRes;
            } else {
                apiRes.message = "question not found";
                apiRes.error = "question not found";
                return apiRes;
            }
        }
    }
    catch (error: any) {
        console.log("error", error);
        apiRes.message = error.message;
        apiRes.error = error;
        return apiRes;
    }
}



