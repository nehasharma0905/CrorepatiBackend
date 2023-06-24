import express, { Request, Response } from 'express';
import { UserModel } from '../models';
import mongoose from 'mongoose';
import { userLogin, userSignUp } from '../services/user.services';

const authentication = express.Router({mergeParams: true});


authentication.post("/create", async (req: Request, res: Response)=>{
    console.log("check_request", req.body, req.query)
    const data = {...req.body};
    const userCreated = await userSignUp({username:data.username, password: data.password});
    res.send({...userCreated});
})

authentication.post("/login", async (req: Request, res: Response)=>{
    console.log("check_request", req.body, req.query)
    const data = {...req.body};
    const userLoginStatus = await userLogin({username:data.username, password: data.password});
    res.send({...userLoginStatus});

})


module.exports = authentication;