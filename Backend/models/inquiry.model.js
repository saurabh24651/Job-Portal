import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status:{
    type:String,
    enum:["pending","contacted","closed"],
    default:"pending"
  }
}, { timestamps: true });

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;