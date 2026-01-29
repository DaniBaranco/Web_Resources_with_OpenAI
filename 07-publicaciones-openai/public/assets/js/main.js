const textarea = document.querySelector(".widget_textarea");
const postBox = document.querySelector(".widget_posts");
const usernameInput = document.querySelector(".widget_username");


document.querySelector(".widget_button--ia").addEventListener("click", async () => {

    textarea.value = "Generando...";

    try {

        const response = await fetch("/api/generate-post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userPreferences: "rock, años 70, música" //Temáticas para publicar el post
            })
        });

        const data = await response.json();

        textarea.value = data.generatedText || "No se generó nada";

    } catch (error) {
        textarea.value = "Error al generar la publicación";

    }

});

document.querySelector(".widget_button--pub").addEventListener("click", () => {

const postText = textarea.value.trim();
const username = usernameInput.value.trim() || "Anónimo";

if(postText.length > 0){
const postArticle = document.createElement("article");
postArticle.classList.add("widget_post");

const userHeader = document.createElement("div");
userHeader.classList.add("widget_post_author");
userHeader.textContent = `@${username}`;

const postContent = document.createElement("p");
postContent.classList.add("widget_post_content");
postContent.textContent = postText;

postArticle.appendChild(userHeader);
postArticle.appendChild(postContent);

postBox.prepend(postArticle);
textarea.value = "";

if(postBox.children.length > 5){
    postBox.classList.add("scrollable");
}

}

});
