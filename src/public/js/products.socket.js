// Establece la conexión con el servidor usando Socket.IO
const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const errorMessage = document.getElementById("error-message");
const btnDeleteProduct = document.getElementById("btn-delete-product");
const btnDeleteCart = document.getElementById("btn-delete-cart");


let currentPage = 1;
let currentSort = "asc";
let currentSortField = "title"; 
let globalCartId;

socket.on("products-list", (data) => {
    const { docs: products, totalPages=1, cartId } = data || {};
    globalCartId = cartId;
    productsList.innerText = "";
    
    if (!cartId) {
        console.error("Cart ID no recibido del servidor.");
        return;
    }

    products.forEach((product) => {
        productsList.innerHTML += `
        <tr>
            <td> ${product.id} </td>
            <td> ${product.title} </td>
            <td> ${product.price} </td>
            <td> ${product.category} </td>
            <td>
                <button class="btn-reset btn info" onclick="window.location.href='/product/${product._id}'"><span><img src="api/public/images/btn-info.png"></button>
                <button class="add-to-cart"  data-product-id="${product.id}">+</button>
                <button class="remove-from-cart"  data-product-id="${product.id}">-</button>
            </td>            
        </tr>
            `;
    });
    const paginationInfo = document.getElementById("pagination-info");
    paginationInfo.dataset.totalPages = totalPages;
    paginationInfo.innerText = `${currentPage} de ${totalPages}`;
    
});

document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        socket.emit("change-page", { page: currentPage, sort: currentSort, sortField: currentSortField });
    }
});

document.getElementById("next-page").addEventListener("click", () => {
    const totalPages = parseInt(document.getElementById("pagination-info").dataset.totalPages, 10);
    if (currentPage < totalPages) {
        currentPage++;
        socket.emit("change-page", {page: currentPage, sort: currentSort, sortField: currentSortField});
    }
});

document.getElementById("title-asc").addEventListener("click", () => {
    currentSort = "asc";
    currentSortField = "title";
    currentPage = 1;
    socket.emit("change-page", {page: currentPage, sort: currentSort, sortField: currentSortField });
});

document.getElementById("title-desc").addEventListener("click", () => {
    currentSort = "desc";
    currentSortField = "title";
    currentPage = 1;
    socket.emit("change-page", { page: currentPage, sort: currentSort, sortField: currentSortField});
});

document.getElementById("category-asc").addEventListener("click", () => {
    currentSort = "asc";
    currentSortField = "category";
    currentPage = 1;
    socket.emit("change-page", { page: currentPage, sort: currentSort, sortField: currentSortField });
});

document.getElementById("category-desc").addEventListener("click", () => {
    currentSort = "desc";
    currentSortField = "category";
    currentPage = 1;
    socket.emit("change-page", { page: currentPage, sort: currentSort, sortField: currentSortField });
});

document.getElementById("price-asc").addEventListener("click", () => {
    currentSort = "asc";
    currentSortField = "price";
    currentPage = 1;
    socket.emit("change-page", { page: currentPage, sort: currentSort, sortField: currentSortField });
});

document.getElementById("price-desc").addEventListener("click", () => {
    currentSort = "desc";
    currentSortField = "price";
    currentPage = 1;
    socket.emit("change-page", { page: currentPage, sort: currentSort, sortField: currentSortField });
});

document.body.addEventListener("click", (event) => {
    const target = event.target;

    if (target.matches(".add-to-cart")) {
        const productId = target.dataset.productId;
        if (productId) {
            socket.emit("add-product", { productId });
        }
    }

    if (target.matches(".remove-from-cart")) {
        const productId = target.dataset.productId;
        if (productId) {
            socket.emit("remove-product", { productId });
        }
    }
});

btnDeleteCart.onclick = (event)=>{
    if (event.target && event.target.id === "btn-delete-cart") {
        socket.emit("delete-cart", { id: globalCartId });
    }
};

productsForm.onsubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const file = formData.get("thumbnail");
    errorMessage.innerText = "";

    socket.emit("insert-product", {
            title: formData.get("title"),
            status: formData.get("status") || "off",
            stock: formData.get("stock"),
            category: formData.get("category"),
            price: formData.get("price"),
            code: formData.get("code"),
            description: formData.get("description"),
            file: {
                name: file.name,
                type: file.type,
                size: file.size,
                buffer: file,
            },
        });
};

btnDeleteProduct.onclick = () => {

    const id = inputProductId.value;
    inputProductId.value = "";
    errorMessage.innerText = "";

    socket.emit("delete-product", { id });

};

socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});


