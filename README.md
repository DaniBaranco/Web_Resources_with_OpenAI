# Recursos para app / web con OpenAI

Colección de ejemplos prácticos que muestran integraciones y widgets con OpenAI (proyectos de ejemplo para curso).

## Descripción

Este repositorio agrupa varios pequeños proyectos web que usan IA para distintas funcionalidades: traducciones, generación de contenidos, asistentes, avatares, planes de dieta, narraciones y widgets de publicaciones.

## Estructura

- 01-traducciones-openai: Ejemplo para traducir textos con IA.
- 02-negocio-openai: Plantilla enfocada en generación/optimización de contenido para negocios.
- 03-asistentes-openai: Ejemplos de asistentes conversacionales.
- 04-avatares-openai: Generación/gestión de avatares.
- 05-dieta-openai: Generador de planes o sugerencias de dieta.
- 06-narraciones-openai: Generación de narraciones o relatos.
- 07-publicaciones-openai: Widget para crear y publicar posts localmente (incluye UI en `public/`).

Cada carpeta contiene un `app.js`, un `package.json` y una carpeta `public/` con la interfaz web y assets.

## Requisitos

- Node.js (recomendado >= 14)
- Conexión a internet si alguno de los ejemplos usa APIs externas

## Instalación y ejecución (por ejemplo)

Abre una terminal en la carpeta del ejemplo que quieras ejecutar y ejecuta:

```bash
cd 07-publicaciones-openai
npm install
# Si el proyecto define un script start en package.json
npm start
# o ejecutar directamente el servidor Node
node app.js
```

Para probar solo la interfaz estática puedes abrir `public/index.html` en el navegador, aunque algunas funcionalidades pueden requerir que se ejecute `app.js` si sirven una API local.

## Notas rápidas

- Cada ejemplo es independiente; instala dependencias dentro de la carpeta correspondiente.
- Si un ejemplo expone un puerto, revisa la salida de la terminal para ver `http://localhost:XXXX`.

## Contribuir

Pull requests, issues y sugerencias son bienvenidas. Para cambios importantes, abre primero una issue describiendo la propuesta.

## Autor

Creado como material del curso "Curso_web_IA".

## Licencia

Sugerencia: MIT — modifica según prefieras.
