import { v4 as uuidv4 } from "uuid";
import { QuestionModel, QuizModel } from "../models";

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
  }
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
      { $match: { difficulty: "medium" } },
      { $sample: { size: numbers[2] } },
    ]);

    questionArray = [
      ...questionArray,
      ...randomMedium.map((el, index) => {
        return el._id;
      }),
    ];

    const randomHard = await QuestionModel.aggregate([
      { $match: { difficulty: "hard" } },
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
    console.log("data", data);
    try {
        const getQuiz = await QuizModel.findOne({ quizId: data.quizId });
        const questionSource = await QuestionModel.findOne({ _id: data.questionId });
        if (getQuiz) {
            const quizQuestionIndex = getQuiz.questions.findIndex(
                (el: any, index: number) => {
                    if (el.questionId == data.questionId) {
                        return { el, index };
                    }
                    else return false;
                }
            );
            const quizQuestion = getQuiz.questions[quizQuestionIndex];
            console.log({questionSource, quizQuestion, quizQuestionIndex});
            if (quizQuestion && questionSource) {
                quizQuestion.lockedAnswer = data.answer;
                if(data.answerId === questionSource.correct.id){
                    quizQuestion.correct = true;
                    quizQuestion.earnedScore = data.earnedScore;
                    getQuiz.score = Number(data.earnedScore);
                    apiRes.status = true;
                    apiRes.message = "question updated successfully";
                    apiRes.data = {
                        isCorrect: true,
                        totalScore: getQuiz.score
                    }
                }
                else {
                    quizQuestion.correct = false;
                    apiRes.status = true;
                    apiRes.message = "question updated successfully";
                    apiRes.data = {
                        isCorrect: false,
                        totalScore: getQuiz.score
                    }
                }
                await getQuiz.save();
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


const use5050lifeLine = async (body: any) => {
  const questionSource = await QuestionModel.findOne({ _id: body.questionId });
  if (questionSource) {
    const temp = questionSource.options.filter((el: any) => el.id !== questionSource.correct.id);
    const randomIndex = Math.floor(Math.random() * temp.length);
    return {
      question: questionSource.question,
      options:
        Math.floor(Math.random() * 2) < 1?
          [temp[randomIndex], questionSource.correct] : [questionSource.correct, temp[randomIndex]],
    }
  }
  else {
    return {error: "question not found"}
  }
}

const exchangeQuestionLifeline = async (body: any, questionArray: any[]) => {
  try {
     const questionIds = questionArray.map((el: any) => {
    return el._id
  })
  const question = await QuestionModel.findOne({ _id: { $nin: questionIds } });
    return question;
  }
  catch (error: any) {
    console.log("error", error);
    return error
  }
 
  
}

const askTheExpertLifeline = async (body: any) => {
  const questionSource = await QuestionModel.findOne({ _id: body.questionId });
  if (questionSource) {
    return {hint: questionSource.hint}
  }
}

export const requestLifeline = async (body: any) => {
   const apiRes: any = {
        status: false,
        message: "",
        error: null,
        data: {},
    };
    try {
      const getQuiz = await QuizModel.findOne({ quizId: body.quizId });
      
        if (getQuiz) {
            const quizQuestionIndex = getQuiz.questions.findIndex(
                (el: any, index: number) => {
                    if (el.questionId == body.questionId) {
                        return { el, index };
                    }
                    else return false;
                }
          );

          let res;
        switch (body.lifelineType) {
          case "50-50":
            res = await use5050lifeLine(body);
            break;
          case "Exchange Question":
            const newQuestion = await exchangeQuestionLifeline(body, getQuiz?.questions || []);
            getQuiz.questions[quizQuestionIndex].questionId = newQuestion._id;
            res = {
              questionId: newQuestion._id,
              question: newQuestion.question,
              options: newQuestion.options
            }
            
            break;
          case "Ask the Expert":
            res = await askTheExpertLifeline(body);
            break;
          default:
          }
          getQuiz.questions[quizQuestionIndex].usedLifeLine = body.lifelineType;
          const lfind = getQuiz.lifelines.findIndex((el: any) => el.title === body.lifelineType)
          getQuiz.lifelines[lfind].used = true;

          await getQuiz.save();
          if (res) {
              apiRes.status = true;
              apiRes.message = "lifeline used successfully";
            apiRes.data = res;
            return apiRes;
              
            } else {
                apiRes.message = "question not found";
                apiRes.error = "question not found";
                return apiRes;
            }
      }
      else {
        apiRes.message = "quiz not found";
        apiRes.error = "quiz not found";
        return apiRes;
      }
    }
    catch (error: any) {
        console.log("error", error);
        apiRes.message = error.message;
        apiRes.error = error;
        return apiRes;
    }
}

