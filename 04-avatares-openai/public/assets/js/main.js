// Seleccionar elemento del DOM
const generateBTN = document.querySelector('.btn-generate');
const avatarBox = document.querySelector('.avatar-box');
const loading = document.querySelector('.loading');
const categorySelector = document.querySelector('.category-selector');

loading.style.display = 'none';


generateBTN.addEventListener('click', async () => {

    //Sacar la categoría seleccionada
    const category = categorySelector.value;

    //Mostrar loading
    loading.style.display = 'block';

    //Hacer la petición al backend
    try {
        const response = await fetch('/api/gen-img',{
        
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({category})
    });

    let data = await response.json();


    //Incrustar la imagen en la caja de avatar
    if(data && data.image_url) {
        avatarBox.innerHTML = `<img src="${data.image_url}" alt="Avatar de ${category}">`;
    } else {
        alert("Hay un error al generar el avatar");
    }


    }catch (error) {
        console.log("Error al generar el avatar:", error);
        alert("No se ha podido generar el avatar");

    }finally {
            loading.style.display = 'none';

    }




});