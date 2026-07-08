import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./config/db.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import companyRouter from "./routes/company.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import savedRouter from "./routes/saved.routes.js";
import inquiryRouter from "./routes/inquiry.routes.js";

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(express.json());

app.use(cors({
    origin: [
        "https://job-portal-dun-ten.vercel.app",
        "https://YOUR-ADMIN.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    credentials: true
}));

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/application", applicationRouter);
app.use("/api/saved", savedRouter);
app.use("/api/inquiry", inquiryRouter);

app.get("/", (req, res) => {
    res.send("API WORKING");
});

app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});