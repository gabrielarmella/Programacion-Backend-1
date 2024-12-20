const cartProductsList = document.getElementById("cart-products-list");
const btnAddToCart = document.querySelectorAll(".add-to-cart");

btnAddToCart.forEach(button => {
    button.addEventListener("click", async (event) => {
        const productId = event.target.dataset.productId;
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "POST"
        });

        if (response.ok) {
            loadCartProducts();
        } else {
            console.error("Error al agregar el producto al carrito");
        }
    });
});

const loadCartProducts = async () => {
    const response = await fetch(`/api/carts/${cartId}`);
    const data = await response.json();
    const products = data.payload.products;

    cartProductsList.innerHTML = "";
    products.forEach(product => {
        cartProductsList.innerHTML += `
            <li>
                ${product.title} - ${product.quantity}
                <button data-product-id="${product._id}" class="remove-from-cart">Eliminar</button>
            </li>
        `;
    });

    const btnRemoveFromCart = document.querySelectorAll(".remove-from-cart");
    btnRemoveFromCart.forEach(button => {
        button.addEventListener("click", async (event) => {
            const productId = event.target.dataset.productId;
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                loadCartProducts();
            } else {
                console.error("Error al eliminar el producto del carrito");
            }
        });
    });
};

loadCartProducts();