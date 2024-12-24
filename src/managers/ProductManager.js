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
    async getAll(params) {
        try {
            const $and = [];
    
            if (params?.title) {
                $and.push({ title: { $regex: params.title, $options: "i" } });
            }
    
            const filters = $and.length > 0 ? { $and } : {};
    
            const sort = {
                asc: { title: 1 },
                desc: { title: -1 },
            };
    
            const paginationOptions = {
                limit: params?.limit || 10,
                page: params?.page || 1,
                sort: sort[params?.sort] ?? {},
                lean: true,
            };
    
            const result = await this.#productModel.paginate(filters, paginationOptions);
            result.docs = result.docs || [];
            return result;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Obtiene un producto específico por su ID
    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw new ErrorManager(error);
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
}
