let sendButton = document.querySelector('#sendButton');

sendButton.addEventListener('click', async (e) => {
    e.preventDefault();

    let inputText = document.querySelector('#inputText');
    const text = inputText.value.trim();
    const targetSpeaker = document.querySelector('#targetSpeaker').value.trim();

    if (!text) return;

    const messagesContainer = document.querySelector('.chat_messages');

    // mensaje del usuario
    const userMessage = document.createElement('div');
    userMessage.className = 'chat_message chat_message--user';
    userMessage.textContent = text;
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;


    //Mensaje de cargando...
    // Mensaje de cargando...
    const botMessage = document.createElement('div');
    botMessage.className = 'chat_message chat_message--bot';
    botMessage.textContent = 'Cargando...';
    messagesContainer.appendChild(botMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;


    try {
        const response = await fetch('/api/speak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                speaker: targetSpeaker
            })
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);


        botMessage.className = 'chat_message chat_message--bot';
        botMessage.innerHTML = `
  <audio controls autoplay>
    <source src="${audioUrl}" type="audio/mpeg">
  </audio>
`;

        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } catch (error) {
        console.error('Error al generar el audio:', error);
    }

    inputText.value = '';
});
