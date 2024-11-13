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
const URL = getParams();
const getAllProduct = URL.baseUrl + URL.getAllEndpoint;
const addProduct = URL.baseUrl + URL.insertEndpoint;
const editById = URL.baseUrl + URL.editEndpoint;
const deleteById = URL.baseUrl + URL.deleteEndpoint;

//Rescatamos el tbody del html
const tbody = document.querySelector("#apiData");

//Hacemos una funcion para obtener todos los productos de la API
function findAll() {
    fetch(getAllProduct)
    .then(response => {
        if(!response.ok){
            throw new Error("Ha ocurrido un error al obtener todos los productos");
        }
        return response.json();
    })
    .then(data =>{
        //Para crear una tabla con todos los datos
        for(product of data){
            let tr = document.createElement('tr');

            let td = document.createElement('td');
            td.textContent = product.id;
            tr.appendChild(td);

            let td2 = document.createElement('td');
            td2.textContent = product.name;
            tr.appendChild(td2);

            let td3 = document.createElement('td');
            td3.textContent = product.price;
            tr.appendChild(td3);

            //En el caso del cuarto td aqui ira un boton eliminar
            let button = document.createElement('button');
            button.textContent = "Delete";
            button.className = 'btn btn-danger';
            let td4 = document.createElement('td');
            td4.appendChild(button);
            tr.appendChild(td4);

            button.addEventListener('click', () => {
                //Almacenamos en el id del boton el id de dicho producto
                button.id = product.id;
                //Guardamos el id del producto en una variable
                idProduct = button.id;
                //Usamos la ruta creada desde la parte de servidor añadiendole el id
                const urlDeleteProduct = deleteById + `${idProduct}`;
                //Hacemos la peticion DELETE usando fetch
                fetch(urlDeleteProduct, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                //Por último, borramos el tbody y lo extraemos de nuevo para que se actualice nuevamente
                .then(() =>{
                    tbody.innerHTML = "";
                    findAll();
                })
            })

            let buttonEdit = document.createElement('button');
            buttonEdit.textContent = "Edit";
            buttonEdit.className = 'btn btn-primary';
            buttonEdit.setAttribute('name', 'buttonEdit');
            buttonEdit.id = product.id;

            let td5 = document.createElement('td');
            td5.appendChild(buttonEdit);
            tr.appendChild(td5);

            buttonEdit.addEventListener('click', () => {
                window.location.href=`../../editProduct/editForm.html?url=${editById}&id=${buttonEdit.id}`;
            })

            //Por último añadimos al tbody este tr
            tbody.appendChild(tr);
        }
    })

}



//Rescatamos el formulario
const productForm = document.querySelector('#productForm');
//Le hacemos un evento a ese product para que cuando haga submit se ejecute la siguiente funcion
productForm.addEventListener('submit', function(e) {
    
    //Evitamos que se envie por defecto
    e.preventDefault();
    
    //Obtenemos los datos
    const name = document.querySelector('#productName').value;
    const price = document.querySelector('#productPrice').value;
    //Validamos que los datos sean validos
    if(name !== "" && price !== ""){
        //Creamos un objeto con los valores introducidos por el usuario
        const newProduct = {
            name: name,
            price: price
        }
        
        fetch(addProduct, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(
            ()=> {
                tbody.innerHTML = ""
                findAll()
            }
        )
        //Obtenemos la respuesta porque en caso de error nos devolvera la respuesta de error por consola
        .then(response => response.json())
        .then((data) => {
            console.log("Hemos añadido: ", data);
        })
        .catch((error) =>{
            console.error(error);
        })
        
    }else{
        console.error="No es posible añadir a la APi datos vacíos";
    }
})

findAll();


