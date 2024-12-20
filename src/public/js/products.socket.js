// Establece la conexión con el servidor usando Socket.IO
const socket = io();

const productList = document.querySelector(".container-products");
const productsForm = document.getElementById("insert-product");
const errorMessage = document.getElementById("error-message");
const inputProductId = document.getElementById("input-product-id");
let prevPageBtn = document.getElementById("prev-page");
let nextPageBtn = document.getElementById("next-page");
let currentPageText = document.getElementById("current-page");

socket.on("products-list", (data) => {
    console.log("Datos recibidos:", data);
    const products = data.products?.docs ?? [];
    
    if (!Array.isArray(products)) {
        console.error("Los datos no son un arreglo:", products);
        return;
    }

    productList.innerHTML = ''; 

    products.forEach((product) => {
        productList.innerHTML += `
            <div class="product-card">
                <ul>
                    <li>Nombre: ${product.title}</li>
                    <li>Precio: ${product.price}</li>
                    <li>Categoría: ${product.category}</li>
                    <li>Descripción: ${product.description}</li>
                    <li>Stock: ${product.stock}</li>
                    <li>Código: ${product.code}</li>
                    <li>Estado: ${product.status}</li>
                    <button class="view-product-btn" data-id="${product._id}">Ver Detalles</button>
                </ul>
            </div>
        `;
    });
});

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadProducts(currentPage); 
    }
});

nextPageBtn.addEventListener("click", () => {
    currentPage++;
    loadProducts(currentPage);  
});

loadProducts(currentPage);

