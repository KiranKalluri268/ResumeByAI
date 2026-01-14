const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const extractText = async (fileBuffer, mimeType) => {
    try {
        if (mimeType === 'application/pdf') {
            const data = await pdfParse(fileBuffer);
            return data.text;
        } else if (
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimeType === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            return result.value;
        } else {
            throw new Error('Unsupported file type. Please upload a PDF or Word document.');
        }
    } catch (error) {
        console.error('Text extraction error:', error);
        throw new Error('Failed to extract text from file.');
    }
};

module.exports = { extractText };
