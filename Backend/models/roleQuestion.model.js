import mongoose from "mongoose";

const roleQuestionSchema = new mongoose.Schema({

    roleId:{
        type:mongoose.Schema.Types.ObjectId,
                      ref:"InterviewRole",
                      required:true
    },

    question:{
        type:String,
         required:true
    },

    answer:{
       type:String,
         default:"Answer not avaible"
    },

    postDate:{
    type:Date,
    default:Date.now
},

createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},

    keyPoints:[
        {
           companyName:String,
         dateAsked:Date
        }
    ]
},{timestamps:true});

export default mongoose.model("RoleQuestion",roleQuestionSchema);