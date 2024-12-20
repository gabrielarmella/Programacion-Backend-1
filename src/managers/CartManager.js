import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import CartModel from "../models/cart.model.js";


export default class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }

    // Busca un carrito por su ID
    async #findOneById(id) {
        if (!isValidID(id)){
            throw new ErrorManager("ID inválido", 400);
        }
        const cart = await this.#cartModel.findById(id).populate("products.product");

        if (!cart) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cart;
    }

    // Obtiene una lista de carrito
    async getAll(params) {
        try {
            const paginationOptions = {
                limit: params?.limit || 10, // Número de documentos por página (por defecto 10)
                page: params?.page || 1, // Página actual (por defecto 1)
                populate: "products.product", // Poblar el campo virtual 'products'
                lean: true, // Convertir los resultados en objetos planos
            };

            return await this.#cartModel.paginate({}, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Obtiene un Carrito específico por su ID
    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Inserta un Carrito
    async insertOneCart(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }


    // Agrega un producto a un carrito o incrementa la cantidad de un producto existente
    addOneProductToCart = async (id, productId) => {
        try {
            const cart = await this.#findOneById(id);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex >= 0) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
    
    // Elimina un producto específico de un carrito
async removeOneProduct(id, productId) {
    try {
        const cart = await this.#findOneById(id);
        cart.products = cart.products.filter((item) => item.product._id.toString() !== productId);
        await cart.save();
        return cart;
    } catch (error) {
        throw new ErrorManager(error.message, error.code);
    }
}

// Actualiza un carrito con un arreglo de productos
async updateCart(id, products) {
    try {
        const cart = await this.#findOneById(id);
        cart.products = products;
        await cart.save();
        return cart;
    } catch (error) {
        throw new ErrorManager(error.message, error.code);
    }
}

// Actualiza la cantidad de un producto específico en un carrito
async updateProductQuantity(id, productId, quantity) {
    try {
        const cart = await this.#findOneById(id);
        const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

        if (productIndex >= 0) {
            cart.products[productIndex].quantity = quantity;
        } else {
            throw new ErrorManager("Producto no encontrado en el carrito", 404);
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new ErrorManager(error.message, error.code);
    }
}

// Elimina todos los productos de un carrito
async clearCart(id) {
    try {
        const cart = await this.#findOneById(id);
        cart.products = [];
        await cart.save();
        return cart;
    } catch (error) {
        throw new ErrorManager(error.message, error.code);
    }
}
}

