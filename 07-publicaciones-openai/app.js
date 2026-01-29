

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

app.post("/api/generate-post", async (req, res) => {

const {userPreferences} = req.body;


  try {

    let PromptSystem = `
    Eres un experto en redes sociales y eres capaz de escribir publicaciones muy creativas. 

    El usuario te va a mandar sus preferencias, gustos personales o temáticas de las que suele hablar, y tú, como su asistente experto, debes crear un texto para una publicacion de máximo 177 caracteres, basado en los gustos del usuario.

    Los textos deben tener un toque ácido o humorístico, incluso, puedo incluir datos curiosos o divulgativos. Alterna el tipo de publicación.

    Es muy importante que el texto que se genere aporte datos específicos y reales sobre lo que se está buscando. Estos datos pueden ser sobre anécdotas reales o cifras relacionadas con algo en concreto.

    Recordatorio importante: Nunca debes generar un texto con más de 250 letras.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages:  [
        { role:"system", content: PromptSystem},
        { role: "user", content: userPreferences}

      ],
      max_tokens: 1000,
      temperature: 1
    });

    const response = completion.choices[0].message.content;

    return res.json({generatedText: response});


  }catch(error){
    console.log(error);
    return res.status(500).json({
      error: "Error al generar la publicación"
    });
  }

});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
