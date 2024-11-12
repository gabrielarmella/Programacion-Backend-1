import ErrorManager from "./ErrorManager.js";
import { generateId } from "../utils/collectionHandler.js";
import { readJsonFile, writeJsonFile, deleteFile } from "../utils/fileHandlers.js";
import paths from "../utils/paths.js";


export default class CartManager {
    #jsonFilename;
    #carts;

        constructor (){
            this.#jsonFilename = "carts.json";
        }
        async #findOneById (id){
            this.#carts = await this.getAll();
            const cartFound = this.#carts.find((item) => item.id === Number(id));

            if (!cartFound){
                throw new Error("Id no encontrado", 404);
            }

            return cartFound;
        }
        async getAll () {
            try {
                this.#carts = await readJsonFile(paths.files, this.#jsonFilename);
                return this.#carts;
            } catch (error) {
                throw new Error("Fallo obtener todo", error.code);
                
            }
        }
        async getOneById (id) {
            try {
                const cartFound = await this.#findOneById(id);
                return cartFound;
            } catch (error) {
                throw new ErrorManager(error.message, error.code);
                
            }
        }

        async insertOne(data, file) {
            try {
                const { title, status, stock } = data;
    
                if (!title || !status || !stock ) {
                    throw new ErrorManager("Faltan datos obligatorios", 400);
                }
    
                if (!file?.filename) {
                    throw new ErrorManager("Falta el archivo de la imagen", 400);
                }
    
                const cart = {
                    id: generateId(await this.getAll()),
                    title,
                    status: convertToBoolean(status),
                    stock: Number(stock),
                    thumbnail: file?.filename,
                };
    
                this.#carts.push(cart);
                await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);
    
                return cart;
            } catch (error) {
                if (file?.filename) await deleteFile(paths.images, file.filename);
                throw new ErrorManager(error.message, error.code);
            }
        }
}