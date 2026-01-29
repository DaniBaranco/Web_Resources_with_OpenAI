// Seleccionar elementos
let userInput = document.querySelector("#inputText");
let resButton = document.querySelector("#resButton");
const chatBox = document.querySelector(".chat_messages");

// ID simple por sesión
const userId = crypto.randomUUID();

function displayMessage(msg, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(
        "chat_message",
        sender === "user" ? "chat_message--user" : "chat_message--bot"
    );
    msgDiv.textContent = msg;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    return msgDiv;
}

async function sendMessage() {
    const myMessage = userInput.value.trim();
    if (!myMessage) return;

    userInput.value = "";

    // Mensaje usuario
    displayMessage(myMessage, "user");

    // Mensaje loading
    await new Promise(resolve => setTimeout(resolve, 1500));

    const loadingMsg = displayMessage("Cargando...", "bot");

    try {
        const res = await fetch("http://localhost:3000/api/nutri-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: userId,
                message: myMessage
            })
        });

        const data = await res.json();

        // Reemplazar loading
        const md = window.markdownit();

        loadingMsg.innerHTML = md.render(data.reply);


    } catch (error) {
        console.error(error);
        loadingMsg.textContent = "Error al conectar con el servidor";
    }
}

resButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
