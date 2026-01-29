import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// --------------------
// CONFIG
// --------------------
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------
// MIDDLEWARES
// --------------------
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --------------------
// OPENAI CLIENT
// --------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --------------------
// CONTEXTO DEL ASISTENTE
// --------------------
const contexto = `
Eres un asistente virtual para un supermercado llamado "Supermercado de barrio".
Tu objetivo es ayudar a los clientes a encontrar productos, responder preguntas sobre ofertas y promociones.
`;

// --------------------
// ENDPOINT CHATBOT
// --------------------
app.post("/api/chatbot", async (req, res) => {
  let { userID, message } = req.body;

  if (userID !== undefined && userID !== null) {
    userID = String(userID).trim();
  }

  if (!userID) {
    return res.status(400).json({ error: "userID inválido o ausente" });
  }

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message es obligatorio" });
  }

  try {
    // Petición al asistente
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: contexto },
        { role: "user", content: message },
      ],
      max_tokens: 200,
    });

    const reply = response.choices[0].message.content;

    return res.status(200).json({ respuesta: reply });
  } catch (error) {
    console.error("Error en chatbot:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

// --------------------
// SERVIDOR
// --------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
