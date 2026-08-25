const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

const Resume = require("./models/Resume");

const { GoogleGenAI } = require("@google/genai");
const cors = require("cors");
const pdf = require("pdf-parse");
const fs = require("fs");

const app = express();

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const upload = multer({ dest: "uploads/" });

const PORT = process.env.PORT || 5000;

// Home Route
app.get("/", (req, res) => {
  res.send("HireSense AI Backend is Running 🚀");
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "HireSense AI Backend is Healthy",
  });
});

app.delete("/api/history", async (req, res) => {
  console.log("🗑 DELETE API CALLED");

  try {
    const result = await Resume.deleteMany({});

    console.log("Delete Result:", result);

    res.json({
      success: true,
      message: "History Cleared Successfully",
      result,
    });
  } catch (error) {
    console.error("Delete Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/history",async(req,res)=>{
  try{
    const resumes = await Resume.find().sort({ createdAt : -1});

    res.json({
      success:true,
      resumes,
    });
  }catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    })
  }
})

// Resume Upload Route
app.post("/api/upload", upload.single("resume"), async (req, res) => {
  try {
    console.log(req.file);

    const dataBuffer = fs.readFileSync(req.file.path);

    console.log("Reading PDF...");
    const data = await pdf(dataBuffer);
    console.log("PDF Read Successfully");

    console.log("Calling Gemini...");

   const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",

  contents: `
You are an ATS Resume Analyzer.

Return ONLY valid JSON.

{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

Resume:
${data.text}
`,
});

    console.log("Gemini Responded");
    const analysis = JSON.parse(response.text);

   const savedResume = await Resume.create({
  fileName: req.file.originalname,
  score: analysis.score,
  strengths: analysis.strengths,
  weaknesses: analysis.weaknesses,
  suggestions: analysis.suggestions,
});

console.log("✅ Resume Saved");
console.log(savedResume);

console.log(analysis);

    res.json({
  success: true,
  analysis,
});
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
