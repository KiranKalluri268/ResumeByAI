import { useState } from 'react'
import './App.css'
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ResumeAI <span className="beta-tag">Beta</span></h1>
        <p>Generate ATS-Optimized Resumes in Seconds</p>
      </header>

      <main>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Generating your professional resume... This may take a minute.</p>
          </div>
        ) : resumeData ? (
          <div className="result-container">
            <button className="back-btn" onClick={() => setResumeData(null)}>&larr; Create Another</button>
            <ResumePreview resumeData={resumeData} />
          </div>
        ) : (
          <ResumeForm setResumeData={setResumeData} setLoading={setLoading} />
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Gemini & OpenAI</p>
      </footer>
    </div>
  )
}

export default App
