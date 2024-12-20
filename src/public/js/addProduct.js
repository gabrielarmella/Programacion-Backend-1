
const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");
const addProductForm = document.getElementById("add-product-form");

const loadProductsList = async () => {
    const limit = 10; 
    const page = 1; 
    const sort = "asc"; 
    const query = "example"; 

    const response = await fetch(`/api/products?limit=${limit}&page=${page}&sort=${sort}&query=${query}`, { method: "GET" });
    const data = await response.json();
    const products = data.payload;

    if (!Array.isArray(products)) {
        console.error("Los datos no son un array");
        return;
    }

    productsList.innerText = "";

    products.forEach((product) => {
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title}</li>`;
    });
};

btnRefreshProductsList.addEventListener("click", () => {
    loadProductsList();
    console.log("¡Lista recargada!");
});

// Se ejecuta para cargar la lista de products al ingresar o refrescar
loadProductsList();

// Poder agregar un producto desde el frontend
addProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(addProductForm);
    const productData = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        category: formData.get("category")
    };


    const response = await fetch("/api/products", {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        console.log("Producto agregado exitosamente");
        loadProductsList();
    } else {
        console.error("Error al agregar el producto");
    }
})