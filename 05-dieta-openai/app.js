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


//Método para hacer petición a OpenAI
const generateDiet = async (userResponses) => {

  //Crear el prompt (sistema, indicaciones para la ia)

  const promtSystem = {
    role: "system",
    content: `Eres un nutricionista profesional y un asistente que ayuda a generar un dieta semananal.

    El usuario solo puede hacer preguntas relacionadas con la dieta, con su peso, altura, objetivo, alergias, alimentos que no le gustan y número de comidas diarias.

    El sistema no responderá a ningún otro tipo de solicitud que no esté relacionada con la dieta.
    
    `
  }

  //Crear el prompt del usuario

  const promtUser = {
    role: "user",
    content: ` 
    Crear una dieta semanal para una persona que sea ${userResponses.peso} kg, mide ${userResponses.altura} cm, cuyo objetivo es ${userResponses.objetivo}, tiene las siguientes alergias: ${userResponses.alergias}, no le gustan los siguientes alimentos: ${userResponses.no_gusta} y quiere hacer ${userResponses.comidas_diarias} comidas diarias.

    Devuelve la dieta en el formato de tabla markdown con las siguientes columnas: día, comida, alimentos, posible receta con los alimentos proporcionados, nombre del plato o receta y calorías aproximadas. Y no digas nada más. Solo devuelve la tabla.
    `
  }

  //Hacer petición a LLM de OpenAI

  try {

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        promtSystem,
        promtUser

      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    //Devolver el resultado generado
    const response = completion.choices[0].message.content.trim();
    return response;

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al generar la dieta" });
  }


};

//Objeto de almacenamiento temporal de respuestas del usuario

let userData = {};



//Ruta / endpoint / url
app.post("/api/nutri-chat", async (req, res) => {

  console.log("USER DATA COMPLETO:", userData);


  //Primero, por defecto, se pregunta el peso del usuario

  //Recibir la respuesta del peso del usuario
  const userId = req.body.id;
  const userMessage = req.body.message;

  if (!userData[userId]) {
    userData[userId] = {};
  }

  if (!userData[userId].peso) {
    userData[userId].peso = userMessage;

    return res.json({ reply: "¿Cuál es tu estatura en cm?" });
  }

  if (!userData[userId].altura) {
    userData[userId].altura = userMessage;

    return res.json({ reply: "¿Cuál es tu objetivo?" });
  }

  if (!userData[userId].objetivo) {
    userData[userId].objetivo = userMessage;

    return res.json({ reply: "Gracias por la información. Ahora, ¿tienes alguna alergia?" });
  }

  if (!userData[userId].alergias) {
    userData[userId].alergias = userMessage;

    return res.json({ reply: "¿Qué alimentos no te gustan?" });
  }

  if (!userData[userId].no_gusta) {
    userData[userId].no_gusta = userMessage;

    return res.json({ reply: "¿Cuántas comidas quieres hacer cada día?" });
  }

  if (!userData[userId].comidas_diarias) {
    userData[userId].comidas_diarias = userMessage;

    //Ejecutar petición a OpenAI con un prompt

    const diet = await generateDiet(userData[userId]);

    //Recoger la respuesta y darle la dieta al usuario

    //Devolver la respuesta al frontend
    return res.json({ reply: `Aquí tienes tu dieta personalizada: \n ${diet}` });
  }

  userData[userId] = {};

  return res.json({ reply: "Gracias por tus respuesta. Ya tienes tu dieta creada." });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
