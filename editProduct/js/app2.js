//Debemos crear una funcion para recoger los parametros de la URL
function getParams() {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var params = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
}

//Llamamos a la funcion que devuelve un objeto con todas las url necesarias
const parametros = getParams();

//Creamos una ruta
const urlEdit = parametros.url + parametros.id;

//Creamos un evento que se ejecute cuando se muestre todo el html
document.addEventListener('DOMContentLoaded', () => {
    //Rescatamos el input
    let input = document.getElementById('productId');
    input.value = parametros.id;

})

let buttonSubmit = document.getElementById('submit');
console.log(buttonSubmit);


