import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { sendForgetPasswordEmail, sendVerificationEmail } from '../utils/emailService.js';
import jwt from 'jsonwebtoken';


export const register =async (req, res)=>{
    try {
        const{name, email, password,role}=req.body;
        const userExist=await User.findOne({email});

        if(userExist){
            return res.status(400).json({
        success: false,
        message:"User already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const userRole = role || "user";

// to generate 6 digit otp

        const verificationOTP= Math.floor(100000+Math.random()*900000).toString();
        const verificationOTPExpires= Date.now()+10*60*1000

        const user =await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            verificationOTP,
            verificationOTPExpires
        });

        // to send the verification email
        try {
            await sendVerificationEmail(email, name, verificationOTP);
        } catch (error) {
            console.error("Failed to send verfication email:",error);
        }
        res.status(201).json({
            success:true,
            message:"Account created succesfully! Please check your email for the 6-digit verification code",

        user:{
            name:user.name,
            email:user.email,
            role:user.role,
            isVerified: false
        }
        });

    } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message
        });
    };
}

//to login  a user
export const login=async(req,res)=>{
    try {
        const{email,password}=req.body;
        const user=await User.findOne({
            email
        });
        if(!user){
            return res.status(400).json({
                success:false,
                message: "Invaild email or password"
            });
        }

        if(!user.isVerified){
            return res.status(401).json({
                success:false,
                message:"Please verify your email address before logging in"
            });
        }
         const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({
                    success:false,
                    message:"Invalid email or password"
                });
            }
//to generate a token
      const token = jwt.sign({
        id:user._id,
        role:user.role
      },
    process.env.JWT_SECRET,{expiresIn:"7d"}) 

    res.status(200).json({
          success:true,
          message:"Login successfully!",
          token,
        user:{
            name:user.name,
            email:user.email,
            role:user.role
        }
    })
    } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message
        });
    };
}

//to verify the email
export const verifyEmail = async(req,res)=>{
    try {
        const{email,otp}=req.body;
        if(!email || !otp){
            return res.status(400).json({
                success:false,
                message:"Email and OTP are required"
            });
        }
           const user = await User.findOne({
            email,
            verificationOTP:otp,
            verificationOTPExpires:{$gt:Date.now()}
           });
if(!user){
    return res.status(400).json({
        success:false,
        message:"Invalid or expired OTP"
    });
        }
user.isVerified=true;
user.verificationOTP=undefined;
user.verificationOTPExpires=undefined;
await user.save();
     
      res.status(200).json({
        success:true,
        message:"Email verified successully! You can now log in"
      }) ;
       } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message
        });
    };
}

//if user forget their password
export const forgetPassword = async(req,res)=>{
    try {
        const{email}=req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email is required"
            });
        }
           const user = await User.findOne({
            email,
           });
if(!user){
    return res.status(400).json({
        success:false,
        message:"User with this email not found"
    });
        }
        const resetOTP=Math.floor(100000+Math.random()*900000).toString();
        const resetOTPExpires=Date.now()+10*60*1000
user.resetPasswordOTP=resetOTP;
user.resetPasswordOTPExpires=resetOTPExpires;
await user.save();
     
try {
    await sendForgetPasswordEmail(email,user.name, resetOTP);
} catch (error) {
    console.error("Failed to send reset email:",error);
}
       return res.status(200).json({
    success: true,
    message: "Reset OTP sent to email"
});
       } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message
        });
    };
}

//to reset the password
export const resetPassword = async(req,res)=>{
    try {
        const{email,otp,newpassword}=req.body;
        if(!email||!otp||!newpassword){
            return res.status(400).json({
                success:false,
                message:"Email,OTP,new Password are required"
            });
        }
           const user = await User.findOne({
            email,
            resetPasswordOTP:otp,
            resetPasswordOTPExpires:{ $gt: Date.now()}    
           });
if(!user){
    return res.status(400).json({
        success:false,
        message:" Invalid or expired OTP"
    });
        }

// to hash new password

        const hashedPassword=await bcrypt.hash(newpassword,10);
         user.password=hashedPassword;
         user.resetPasswordOTP=undefined;
         user.resetPasswordOTPExpires=undefined;
           await user.save();
     
           res.status(200).json({
            success:true,
            message:"Password reset successful You can now log in with new password"
        });
// try {
//     await sendForgetPasswordEmail(email,user.name, resetOTP);
// } catch (error) {
//     console.error("Failed to send reset email:",error);
// }
       } catch (err) {
        res.status(500).json({
            success:false,
            message:err.message
        });
    };
}