const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const generateResumeContent = async (userData, jobDescription, modelProvider = 'gemini') => {
    const prompt = `
    You are an expert resume writer and ATS optimization specialist.
    Create a professional resume content based on the following:

    USER INFORMATION / OLD RESUME CONTENT:
    ${userData}

    TARGET JOB DESCRIPTION:
    ${jobDescription}

    INSTRUCTIONS:
    1. Parse the user information and tailor it to the job description.
    2. Use strong action verbs and quantify achievements where possible.
    3. Include sections: Personal Details, Summary, Skills, Work Experience, Education, Projects.
    4. Return the result in a JSON format with the following structure:
    {
      "personalDetails": { "name": "", "email": "", "phone": "", "linkedin": "", "portfolio": "" },
      "summary": "",
      "skills": [],
      "experience": [ { "role": "", "company": "", "duration": "", "points": [""] } ],
      "education": [ { "degree": "", "institution": "", "year": "" } ],
      "projects": [ { "name": "", "description": "", "techStack": [] } ]
    }
    5. IMPORTANT: Return ONLY the JSON string. Do not include markdown formatting like \`\`\`json.
  `;

    try {
        if (modelProvider === 'gemini') {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            // Cleanup markdown if present
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);

        } else if (modelProvider === 'openai') {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const response = await openai.chat.completions.create({
                model: 'gpt-4', // Or gpt-3.5-turbo
                messages: [{ role: 'user', content: prompt }],
            });
            let text = response.choices[0].message.content;
            // Cleanup markdown if present
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);

        } else if (modelProvider === 'claude') {
            // Placeholder for Claude - avoiding extra dependency unless requested specifically or providing generic fetch implementation
            throw new Error("Claude integration not yet implemented in this MVP step.");
        } else {
            throw new Error('Invalid model provider selected.');
        }
    } catch (error) {
        console.error('LLM Generation Error:', error);
        throw new Error('Failed to generate resume content.');
    }
};

module.exports = { generateResumeContent };
