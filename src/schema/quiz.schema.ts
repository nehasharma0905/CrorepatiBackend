import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;


const lifeLineSchema = new Schema({
    title: String,
    used: Boolean,
});

export const userQuizQuestionSchema = new Schema({
    questionId: ObjectId,
    lockedAnswer: String || null,
    correct: Boolean || null,
    usedLifeLine: String || null,
    earnedScore: Number || null
});


export const quizSchema = new Schema({
    quizId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: false
    },
    questions: {
        type: [userQuizQuestionSchema],
        required: true,
        unique: false
    },
    lifelines: {
        type: [lifeLineSchema],
        required: true,
        unique: false
    },
    score: {
        type: Number,
        required: true,
        unique: false
    }


});