let translateButton = document.querySelector('#sendButton');

translateButton.addEventListener('click', async () => {

    let inputText = document.querySelector('#inputText');

    // valor a traducir
    const text = inputText.value.trim();

    // lenguaje de destino
    const targetLang = document.querySelector('#targetLang').value.trim();

    if (!text) return false;

    // meter el mensaje del usuario a la caja de mensajes
    const userMessage = document.createElement('div');
    userMessage.className = 'chat_message chat_message--user'; // ✅ corregido typo
    userMessage.textContent = text;

    const messagesContainer = document.querySelector('.chat_messages');
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // petición ajax al backend
    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text,
                targetLanguage: targetLang // ✅ nombre correcto para backend
            })
        });

        const data = await response.json();

        // agregar el mensaje de la IA al chat
        const botMessage = document.createElement('div');
        botMessage.className = 'chat_message chat_message--bot'; // ✅ fondo gris OK
        botMessage.textContent = data.translatedText || 'Error en la traducción';

        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } catch (error) {
        console.error('Error al traducir:', error);
    }

    // vaciar el input de texto
    inputText.value = '';
});
