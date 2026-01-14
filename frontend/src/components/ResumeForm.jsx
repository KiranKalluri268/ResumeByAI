import React, { useState } from 'react';
import axios from 'axios';

const ResumeForm = ({ setResumeData, setLoading }) => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [modelProvider, setModelProvider] = useState('gemini');
    const [inputType, setInputType] = useState('upload'); // 'upload' or 'manual'

    // Structured manual data state
    const [manualData, setManualData] = useState({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        summary: '',
        experience: '',
        education: '',
        skills: '',
        projects: ''
    });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleManualChange = (e) => {
        const { name, value } = e.target;
        setManualData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        if (inputType === 'upload' && file) {
            formData.append('file', file);
        } else if (inputType === 'manual') {
            // Aggregate structured data into a single string for the backend prompt
            const formattedDetails = `
            Name: ${manualData.name}
            Email: ${manualData.email}
            Phone: ${manualData.phone}
            LinkedIn: ${manualData.linkedin}
            Portfolio: ${manualData.portfolio}

            Professional Summary:
            ${manualData.summary}

            Work Experience:
            ${manualData.experience}

            Education:
            ${manualData.education}

            Skills:
            ${manualData.skills}

            Projects:
            ${manualData.projects}
            `;
            formData.append('userDetails', formattedDetails);
        }

        formData.append('jobDescription', jobDescription);
        formData.append('modelProvider', modelProvider);

        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await axios.post(`${apiUrl}/api/generate-resume`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResumeData(response.data);
        } catch (error) {
            console.error('Error generating resume:', error);
            alert('Failed to generate resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-form-container">
            <h2>Create Your AI Resume</h2>
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>How do you want to provide your details?</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                value="upload"
                                checked={inputType === 'upload'}
                                onChange={() => setInputType('upload')}
                            />
                            Upload Current Resume
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="manual"
                                checked={inputType === 'manual'}
                                onChange={() => setInputType('manual')}
                            />
                            Enter Details Manually
                        </label>
                    </div>
                </div>

                {inputType === 'upload' ? (
                    <div className="form-group">
                        <label>Upload Resume (PDF/Word)</label>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required={inputType === 'upload'} />
                    </div>
                ) : (
                    <div className="manual-entry-form">
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label>Full Name</label>
                                <input type="text" name="name" value={manualData.name} onChange={handleManualChange} placeholder="John Doe" required={inputType === 'manual'} />
                            </div>
                            <div className="form-group half-width">
                                <label>Email</label>
                                <input type="email" name="email" value={manualData.email} onChange={handleManualChange} placeholder="john@example.com" required={inputType === 'manual'} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label>Phone</label>
                                <input type="text" name="phone" value={manualData.phone} onChange={handleManualChange} placeholder="+1 555-0102" />
                            </div>
                            <div className="form-group half-width">
                                <label>LinkedIn URL</label>
                                <input type="text" name="linkedin" value={manualData.linkedin} onChange={handleManualChange} placeholder="linkedin.com/in/johndoe" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Portfolio / Website</label>
                            <input type="text" name="portfolio" value={manualData.portfolio} onChange={handleManualChange} placeholder="johndoe.com" />
                        </div>

                        <div className="form-group">
                            <label>Professional Summary</label>
                            <textarea name="summary" value={manualData.summary} onChange={handleManualChange} rows="3" placeholder="Brief overview of your career..." />
                        </div>

                        <div className="form-group">
                            <label>Work Experience</label>
                            <textarea name="experience" value={manualData.experience} onChange={handleManualChange} rows="5" placeholder="Company Name - Role (Years)&#10;- Achievement 1&#10;- Achievement 2" required={inputType === 'manual'} />
                            <small>List your relevant roles and key achievements.</small>
                        </div>

                        <div className="form-group">
                            <label>Education</label>
                            <textarea name="education" value={manualData.education} onChange={handleManualChange} rows="3" placeholder="Degree, University, Year" />
                        </div>

                        <div className="form-group">
                            <label>Skills</label>
                            <textarea name="skills" value={manualData.skills} onChange={handleManualChange} rows="3" placeholder="JavaScript, React, Node.js, Team Leadership..." required={inputType === 'manual'} />
                        </div>

                        <div className="form-group">
                            <label>Projects</label>
                            <textarea name="projects" value={manualData.projects} onChange={handleManualChange} rows="4" placeholder="Project Name: Description and tech stack used." />
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label>Target Job Description</label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                        rows="6"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Select Model</label>
                    <select value={modelProvider} onChange={(e) => setModelProvider(e.target.value)}>
                        <option value="gemini">Google Gemini (Free/Fast)</option>
                        <option value="openai">OpenAI GPT-4 (Requires Key)</option>
                        <option value="claude">Claude (Coming Soon)</option>
                    </select>
                </div>

                <button type="submit" className="generate-btn">Generate Resume</button>
            </form>
        </div>
    );
};

export default ResumeForm;
