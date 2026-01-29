

import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la carpeta public (frontend)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/speak', async (req, res) => {
  try {
    const { text, speaker } = req.body;

    if (!text || !speaker) {
      return res.status(400).json({ error: 'Debes mandar texto y speaker' });
    }

    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: speaker, // ej: "alloy"
      input: text,
      format: "mp3"
    });

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);

    res.send(audioBuffer);

  } catch (error) {
    console.error('Error en /api/speak:', error);
    res.status(500).json({ error: 'Error generando el audio' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
