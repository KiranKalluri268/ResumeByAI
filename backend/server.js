const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { extractText } = require('./utils/extractText');
const { generateResumeContent } = require('./services/llmService');

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
    res.send('ResumeAI Backend is running');
});

app.post('/api/generate-resume', upload.single('file'), async (req, res) => {
    try {
        const { jobDescription, userDetails, modelProvider } = req.body;
        let combinedUserData = userDetails || '';

        if (req.file) {
            try {
                const extractedText = await extractText(req.file.buffer, req.file.mimetype);
                combinedUserData += `\n\nEXTRACTED RESUME DATA:\n${extractedText}`;
            } catch (extractError) {
                return res.status(400).json({ error: extractError.message });
            }
        }

        if (!combinedUserData && !req.file) {
            return res.status(400).json({ error: 'Please provide user details or upload a resume.' });
        }

        if (!jobDescription) {
            return res.status(400).json({ error: 'Please provide a job description.' });
        }

        const generatedResume = await generateResumeContent(combinedUserData, jobDescription, modelProvider);
        res.json(generatedResume);

    } catch (error) {
        console.error('Error generating resume:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
