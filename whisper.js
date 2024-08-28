import { config } from 'dotenv';
import axios from 'axios';
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'

// Configuración de la API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Primera parte: Transcripción de audio con Whisper
export const transcribeAudio = async () => {
    const filePath = path.join(__dirname, 'audio2.mp3');
    const model = 'whisper-1';

    const formData = new FormData();
    formData.append("model", model);
    formData.append("file", fs.createReadStream(filePath));

    try {
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            },
        });

        console.log(`\nTranscripción de audio:\n${JSON.stringify(response.data, null, 2)}\n`);
    } catch (error) {
        console.error(`\nError en la transcripción de audio:\n${error}\n`);
    }
};
