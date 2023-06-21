import express, {Request, Response} from 'express';
const authentication = require("./authentication");
const questions = require("./questions");
const quiz = require("./quiz");

const routers = express.Router({mergeParams: true});


routers.get("/", (req:Request, res: Response)=>{
    res.send("Hello")
})

routers.use("/auth", authentication);
routers.use("/quiz", quiz);
routers.use("/questions", questions);



module.exports = routers;
