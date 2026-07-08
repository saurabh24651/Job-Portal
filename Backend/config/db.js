import mongoose from "mongoose";

export const connectDB =async(req,res)=>{
    await mongoose.connect("mongodb+srv://saurabh24651_db_user:Saurabh9123@cluster0.ola3u80.mongodb.net/Job")
.then(()=>{
    console.log("DB Connected")
})
}