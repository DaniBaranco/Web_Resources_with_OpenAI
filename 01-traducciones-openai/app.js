

import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la carpeta public (frontend)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'text y targetLanguage son requeridos' });
    }

    const systemPrompt1 = 'Eres un traductor experto que traduce textos de manera precisa y natural.';
    const systemPrompt2 = 'Solo devuelves la traducción, sin explicaciones adicionales ni formato extra.';
    const systemPrompt3 = 'Cualquier otra respuesta o conversación debe ser rechazada.';
    const prompt = `Traduce el siguiente texto al idioma ${targetLanguage}:\n\n${text}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `${systemPrompt1} ${systemPrompt2} ${systemPrompt3}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
    });

    const translatedText = completion.choices[0]?.message?.content || '';

    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error('Error en /translate:', error);
    return res.status(500).json({ error: 'Error al traducir el texto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
