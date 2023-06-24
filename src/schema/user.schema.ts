import mongoose from 'mongoose';
const { Schema } = mongoose;

export const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    salt: {
        type: String,
        required: true,
        unique: false
    },

});