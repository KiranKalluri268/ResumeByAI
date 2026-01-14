import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

const ResumePreview = ({ resumeData }) => {
    const resumeRef = useRef();
    const [editableData, setEditableData] = useState(resumeData);

    useEffect(() => {
        setEditableData(resumeData);
    }, [resumeData]);

    const handleExportPDF = () => {
        const element = resumeRef.current;
        const opt = {
            margin: 0,
            filename: `${editableData.personalDetails.name.replace(/\s+/g, '_')}_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handlePrint = () => {
        window.print();
    };

    const handleInputChange = (section, index, field, value) => {
        // Helper to deeply update state - simple version for demo
        const newData = { ...editableData };
        if (section === 'personalDetails') {
            newData.personalDetails[field] = value;
        } else if (Array.isArray(newData[section])) {
            newData[section][index][field] = value;
        } else {
            newData[section] = value;
        }
        setEditableData(newData);
    };

    return (
        <div className="resume-preview-container">
            <div className="actions-bar">
                <button onClick={handleExportPDF} className="action-btn">Download PDF</button>
                <button onClick={handlePrint} className="action-btn">Print</button>
            </div>

            <div className="resume-paper" ref={resumeRef} id="resume-content">
                {/* Header */}
                <div className="resume-header">
                    <h1 contentEditable suppressContentEditableWarning onBlur={(e) => handleInputChange('personalDetails', null, 'name', e.target.innerText)}>
                        {editableData.personalDetails.name || 'Your Name'}
                    </h1>
                    <div className="contact-info">
                        <span>{editableData.personalDetails.email}</span> | <span>{editableData.personalDetails.phone}</span>
                        {editableData.personalDetails.linkedin && <span> | {editableData.personalDetails.linkedin}</span>}
                        {editableData.personalDetails.portfolio && <span> | {editableData.personalDetails.portfolio}</span>}
                    </div>
                </div>

                <hr />

                {/* Summary */}
                <div className="resume-section">
                    <h3>Professional Summary</h3>
                    <p contentEditable suppressContentEditableWarning onBlur={(e) => handleInputChange('summary', null, null, e.target.innerText)}>
                        {editableData.summary}
                    </p>
                </div>

                {/* Skills */}
                <div className="resume-section">
                    <h3>Skills</h3>
                    <div className="skills-list" contentEditable suppressContentEditableWarning>
                        {/* Simplified for editing as text for now, ideally tags */}
                        {editableData.skills.join(', ')}
                    </div>
                </div>

                {/* Experience */}
                <div className="resume-section">
                    <h3>Work Experience</h3>
                    {editableData.experience.map((exp, index) => (
                        <div key={index} className="experience-item">
                            <div className="item-header">
                                <strong contentEditable suppressContentEditableWarning>{exp.role}</strong>
                                <span contentEditable suppressContentEditableWarning>{exp.company}</span>
                                <span contentEditable suppressContentEditableWarning>{exp.duration}</span>
                            </div>
                            <ul className="item-points">
                                {exp.points.map((point, pIndex) => (
                                    <li key={pIndex} contentEditable suppressContentEditableWarning>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                <div className="resume-section">
                    <h3>Projects</h3>
                    {editableData.projects.map((proj, index) => (
                        <div key={index} className="project-item">
                            <div className="item-header">
                                <strong contentEditable suppressContentEditableWarning>{proj.name}</strong>
                            </div>
                            <p contentEditable suppressContentEditableWarning>{proj.description}</p>
                            <small>Stack: {proj.techStack.join(', ')}</small>
                        </div>
                    ))}
                </div>

                {/* Education */}
                <div className="resume-section">
                    <h3>Education</h3>
                    {editableData.education.map((edu, index) => (
                        <div key={index} className="education-item">
                            <div className="item-header">
                                <strong contentEditable suppressContentEditableWarning>{edu.degree}</strong>
                                <span contentEditable suppressContentEditableWarning>{edu.institution}</span>
                                <span contentEditable suppressContentEditableWarning>{edu.year}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ResumePreview;
