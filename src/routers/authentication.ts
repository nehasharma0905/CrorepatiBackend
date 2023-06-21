import express, { Request, Response } from 'express';

const authentication = express.Router({mergeParams: true});;


authentication.get("/", (req:Request, res: Response)=>{
    res.send("Hello2")
})


authentication.post("/create", (req: Request, res: Response)=>{
    res.json({message:"created"})

})

authentication.get("/create2", (req: Request, res: Response)=>{
    res.send("Test")
})


module.exports = authentication;