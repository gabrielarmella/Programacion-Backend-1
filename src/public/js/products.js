document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    const btnRefresh = document.getElementById('btn-refresh-products-list');

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const products = await response.json();
            productsList.innerHTML = '';
            products.forEach(product => {
                const li = document.createElement('li');
                li.textContent = `${product.name} - $${product.price}`;
                productsList.appendChild(li);
            });
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    btnRefresh.addEventListener('click', fetchProducts);

    fetchProducts();
});