import mongoose from 'mongoose';
const { Schema } = mongoose;


const option = new Schema({ 
    id: String,
    text: String 
});

export const questionSchema = new Schema({
    question: {
        type: String,
        required: true,
        unique: true
    },
    options: {
        type: [option],
        required: true,
        unique: false
    },
    correct: {
        type: option,
        required: true,
        unique: false
    },
    explanation: {
        type: String,
        required: false,
        unique: false
    },
    hint: {
        type: String,
        required: false,
        unique: false
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard", "extreme"],
        unique: false
    } 

});