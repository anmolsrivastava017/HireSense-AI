import { useState } from "react";
import jsPDF from "jspdf";

function Hero() {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Upload Resume
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }

    setLoading(false);
  };

  // View History
  const getHistory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/history");
      const data = await response.json();

      if (data.success) {
        setHistory(data.resumes);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const clearHistory = async () => {
  const response = await fetch("http://localhost:5000/api/history", {
    method: "DELETE",
  });

  const data = await response.json();

  if (data.success) {
    setHistory([]);
    alert("History Cleared Successfully");
  }
};

  // Download PDF
  const handleDownload = () => {
    if (!analysis) return;

    const doc = new jsPDF();

    doc.text("AI Resume Analysis", 20, 20);
    doc.text(`Resume Score: ${analysis.score}/100`, 20, 35);

    doc.text("Strengths:", 20, 50);
    doc.text(analysis.strengths.join(", "), 20, 60);

    doc.text("Weaknesses:", 20, 90);
    doc.text(analysis.weaknesses.join(", "), 20, 100);

    doc.text("Suggestions:", 20, 130);
    doc.text(analysis.suggestions.join(", "), 20, 140);

    doc.save("Resume-Analysis.pdf");
  };

  return (
    <>
      <div className="hero">
        <h1>AI Resume Analyzer</h1>

        <p>Analyze your resume and get AI-Powered Feedback</p>

        <input
          id="resume"
          type="file"
          hidden
          accept=".pdf"
          onChange={(e) => {
            const selectedFile = e.target.files[0];

            if (selectedFile) {
              setFileName(selectedFile.name);
              setFile(selectedFile);
            }
          }}
        />

        <label htmlFor="resume" className="upload-btn">
          UPLOAD RESUME
        </label>

        {fileName && (
          <>
            <p>Selected File: {fileName}</p>

            <button
              className="analyze-btn"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "ANALYZE RESUME"}
            </button>

            <button
              className="history-btn"
              onClick={getHistory}
            >
              VIEW HISTORY
            </button>
          </>
        )}
      </div>

      {analysis && (
        <div className="analysis-box">
          <h1>✅ AI Resume Analysis</h1>

          <div className="score-card">
            <h2>Resume Score</h2>

            <div className="score-circle">
              {analysis.score}
              <span>/100</span>
            </div>

            <p className="score-status">
              {analysis.score >= 80
                ? "🟢 Excellent Resume"
                : analysis.score >= 60
                ? "🟡 Good Resume"
                : "🔴 Needs Improvement"}
            </p>
          </div>

          <h2>Strengths</h2>
          <ul>
            {analysis.strengths.map((item, index) => (
              <li key={index}>✔ {item}</li>
            ))}
          </ul>

          <h2>Weaknesses</h2>
          <ul>
            {analysis.weaknesses.map((item, index) => (
              <li key={index}>❌ {item}</li>
            ))}
          </ul>

          <h2>Suggestions</h2>
          <ul>
            {analysis.suggestions.map((item, index) => (
              <li key={index}>💡 {item}</li>
            ))}
          </ul>

          <button
            className="download-btn"
            onClick={handleDownload}
          >
            📄 Download Report
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="analysis-box">
          <h2>📜 Resume History</h2>
          <button
  className="history-btn"
  onClick={clearHistory}
>
  🗑 Clear History
</button>

          {history.map((resume) => (
            <div
              key={resume._id}
              style={{
                borderBottom: "1px solid #ccc",
                padding: "10px 0",
              }}
            >
              <h3>{resume.fileName}</h3>
              <p>
                <strong>Score:</strong> {resume.score}/100
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Hero;