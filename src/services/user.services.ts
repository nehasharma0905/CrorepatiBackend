import { UserModel } from "../models";

const bcrypt = require('bcrypt');

interface userSignUpInterface {
    username?: string,
    password: string,
}






export const userSignUp = async ({username, password}: userSignUpInterface): Promise<any>=>{
    const apiRes = {
        status: false,
        message: '',
        error: null,
    }

    try {
            const salt = await bcrypt.genSalt(10); // Generate a salt
            const hash = await bcrypt.hash(password, salt); // Hash the password
            const newUser = new UserModel({
              username: username,
              password: hash, // Store the hashed password
              salt: salt // Store the salt
            });
            const db_res = await newUser.save()
                console.log("user created", db_res)
                apiRes.status = true,
                apiRes.message = 'user created successfully'
                console.log('User saved successfully');
                return apiRes;
    } catch (error: any) {
        console.error('Error saving user:', error, error.code);
                if(error.code === 11000){
                    console.error('Error saving user 2:', error.code, error.message);
                    apiRes.message = 'username already exist';
                }
                else apiRes.message = error.message;
                apiRes.status = false;
                apiRes.error = error.message;
                return apiRes;
    }

        
       
}



export const userLogin = async ({username, password}: userSignUpInterface): Promise<any>=>{
    const apiRes = {
        authStatus: false,
        message: '',
        error: null,
    }
    try {
        const user = await UserModel.findOne({'username': username})
        if(!user){
            apiRes.message = 'user doesn\'t exist'
            return apiRes;
        }
        let isPasswordCorrect = false;
        const hash = await bcrypt.hash(password, user?.salt);
        isPasswordCorrect =  user?.password === hash;
        if(isPasswordCorrect){
            apiRes.authStatus = true;
            apiRes.message = 'user login successful'
        }else {
            apiRes.message = 'password is not correct'
        }
        console.log('User loggedIn successfully');
      } catch (err: any) {
        apiRes.error = err;
        console.error('Error retrieving user:', err);
      }
    return apiRes;
}