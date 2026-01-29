import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la carpeta public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post("/api/gen-img", async (req, res) => {

  const apiKey = process.env.OPENAI_API_KEY;
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ error: "La categoría es obligatoria" });
  }

  const myPrompt = `
Eres un diseñador gráfico experto.
Tu objetivo final es crear un avatar único y atractivo basado en la categoría proporcionada.
Estilo: cartoon (tipo dibujo animado).
Dimensiones: 256x256px.
El fondo de la imagen debe ser color sólido.
Protagonista del avatar: relacionado con la categoría "${category}". Debes ser preciso con cada ${category}. Si lo haces bien, tendrás un gran premio y reconocimiento.
En el avatar debe aparecer claramente un/a ${category}.
`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-3",
        prompt: myPrompt,
        size: "1024x1024",
        response_format: "url"
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const imageUrl = response.data.data[0].url;

    return res.json({
      image_url: imageUrl
    });

  } catch (error) {
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    return res.status(500).json({ error: "Error al generar la imagen" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
