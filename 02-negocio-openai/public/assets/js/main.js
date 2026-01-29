const sendButton = document.querySelector('#sendButton');
const inputElement = document.querySelector('#inputText');
const messagesContainer = document.querySelector('.chat_messages');
const userID = Date.now() + Math.floor(777 + Math.random() * 7000);

async function sendMessage() {
    const inputText = inputElement.value.trim();
    if (!inputText) return;

    // Mensaje del usuario
    messagesContainer.innerHTML += `
        <div class="chat_message chat_message--user">
            Yo: ${inputText}
        </div>
    `;

    // Limpiar input
    inputElement.value = '';

    try {
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                userID,
                message: inputText })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Mensaje de la IA
        messagesContainer.innerHTML += `
            <div class="chat_message chat_message--bot">
                Carmen: ${data.respuesta}
            </div>
        `;

    } catch (error) {
        console.error('Error al obtener la respuesta del asistente:', error);

        messagesContainer.innerHTML += `
            <div class="chat_message chat_message--bot chat_message--error">
                Carmen: Lo siento, ha ocurrido un error 😕
            </div>
        `;
    }

    // Scroll al final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Click en botón
sendButton.addEventListener('click', sendMessage);

// Enviar con Enter
inputElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});
