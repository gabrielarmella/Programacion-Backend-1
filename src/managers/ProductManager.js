import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import ProductModel from "../models/product.model.js";
import {convertToBoolean} from "../utils/converter.js"

export default class ProductManager {
    #productModel;

    constructor() {
        this.#productModel = ProductModel;
    } 

    // Busca un producte por su ID
    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const product = await this.#productModel.findById(id);

        if (!product) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return product;
    }

    // Obtiene una lista de productos
    async getAll(params){
        try {
            const filters = {};
            
            if (params?.category) {
                filters.category = params.category;
            }
            
            if (params?.search) {
                filters.$or = [
                    { title: { $regex: params.search, $options: 'i' }},
                    { description: { $regex: params.search, $options: 'i' }}
                ];
            }
            const paginationOptions = {
                page: params?.page || 1, 
                limit: params?.limit || 10, 
                sort: params?.sort ? { [params.sort]: params?.order === 'desc' ? -1 : 1 } : { createdAt: -1 },
                lean: true, 
            };

            return await this.#productModel.paginate(filters, paginationOptions);
        } catch (error) {
            throw new ErrorManager(`Error al obtener productos: ${error.message}`, 500);
        }
    }

    // Obtiene un producto específico por su ID
    async getOneById(id) {
        try {
            const productFound = await this.#findOneById(id);
            return productFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Inserta un producto
    async insertOne(data) {
        try {
            const product = await this.#productModel.create({
                ...data,
                status: convertToBoolean(data.status),
            });

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }

    }

    // Actualiza un producto en específico
    async updateOneById(id, data) {
        try {
            const product = await this.#findOneById(id);
            const newValues = {
                ...product,
                ...data,
                status: data.status ? convertToBoolean(data.status) : product.status,
            };

            product.set(newValues);
            product.save();

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }


    // Elimina un producte en específico
    async deleteOneById(id) {
        try {
            const product = await this.#findOneById(id);
            await product.deleteOne();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async getProducts() {
        // Aquí deberías implementar la lógica para obtener los productos de la base de datos
        // Por ejemplo:
        // return await ProductModel.find();
        return [
            { id: 1, name: 'Producto 1', price: 100 },
            { id: 2, name: 'Producto 2', price: 200 },
        ];
    }
}