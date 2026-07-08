import express from 'express';
import { 
    forgetPassword, 
    register, 
    resetPassword, 
    verifyEmail, 
    login 
} from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/register",register);
authRouter.post("/verify-email",verifyEmail);
authRouter.post("/login",login);
authRouter.post("/forget-password",forgetPassword);
authRouter.post("/reset-password",resetPassword);

export default authRouter;