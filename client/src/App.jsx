import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {

  const [message, setMessage] = useState("");
  const [page, setPage] = useState("home");


  useEffect(() => {
    fetch("https://hiresense-ai-lg6y.onrender.com/api/health")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      });
  }, []);


  return (
    <div>

      <Navbar 
        title="HireSense AI"
        setPage={setPage}
      />


      {page === "home" && (
        <>
          <Hero />
          <h2>{message}</h2>
        </>
      )}


      {page === "features" && (
        <section className="info-section">

          <h1>🚀 HireSense AI Features</h1>

          <div>
            <h3>🤖 AI Resume Analysis</h3>
            <p>
              Analyze your resume using Artificial Intelligence
              and get detailed feedback.
            </p>
          </div>


          <div>
            <h3>📊 ATS Resume Score</h3>
            <p>
              Get an ATS compatibility score and understand
              your resume performance.
            </p>
          </div>


          <div>
            <h3>💡 Smart Suggestions</h3>
            <p>
              Receive AI-powered suggestions to improve your resume.
            </p>
          </div>


          <div>
            <h3>📜 Resume History</h3>
            <p>
              Store and manage your previous resume analysis reports.
            </p>
          </div>


        </section>
      )}



      {page === "about" && (
        <section className="info-section">

          <h1>About HireSense AI</h1>


          <p>
            HireSense AI is an AI-powered resume analyzer
            designed to help students and job seekers improve
            their resumes.
          </p>


          <p>
            The platform analyzes resumes, provides ATS scores,
            identifies strengths and weaknesses, and gives
            personalized improvement suggestions.
          </p>


          <h3>Technology Used</h3>


          <ul>
            <li>⚛️ React.js - Frontend</li>
            <li>🚀 Node.js & Express.js - Backend</li>
            <li>🍃 MongoDB - Database</li>
            <li>🤖 Gemini AI - Resume Analysis</li>
            <li>📄 PDF Parsing</li>
          </ul>


        </section>
      )}


    </div>
  );
}


export default App;
