import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Necesario para ES Modules (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Contexto del asistente
const contexto = `
Eres un asistente virtual para un supermercado llamado "Supermercado de barrio".
Tu objetivo es ayudar a los clientes a encontrar productos, responder preguntas sobre ofertas y promociones.

Información del supermercado:
- Ubicación: Calle José María de la Fuente, 5, Madrid, España
- Horario: Lunes a Sábado, 9:00 - 21:00
- Productos: Frutas, verduras, carnes, productos lácteos, productos de limpieza, etc.
- Marcas: Coca-Cola, Nestlé, Danone, Colgate, Fairy, Gallina Blanca, Campofrío,
  Central Lechera Asturiana, Mahou, El Pozo, Knorr, Hacendado, Puleva, Don Simón,
  Gallo, Ybarra, Pescanova, Bimbo, L'Oréal, Nivea
- Métodos de pago: Efectivo, tarjeta, Bizum
- Servicios: Entrega a domicilio, recogida en tienda, atención al cliente
- Políticas: Devoluciones en 30 días
- Inventar un stock variado de los productos mencionados.

Reglas:
- Solo puedes responder preguntas relacionadas con el supermercado.
- Si la pregunta no está relacionada, recházala educadamente.
- Responde de forma breve y clara.
`;

let conversations = {};

// Endpoint chatbot
app.post("/api/chatbot", async (req, res) => {




  const { userID, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "El mensaje es requerido" });
  }

  let response;

  try {
    response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: contexto },
        { role: "user", content: message },
      ],
      max_tokens: 200,
    });
  } catch (error) {
    console.error("Error en OpenAI:", error);
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }

  const respuestaIA = response.choices[0].message.content;

  return res.status(200).json({
    respuesta: respuestaIA,
  });
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
