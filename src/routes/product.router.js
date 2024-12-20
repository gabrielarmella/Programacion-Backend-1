import { Router } from "express";
import ProductManager from "../managers/ProductManager.js"
import uploader from "../utils/uploader.js";

const router = Router();
const productManager = new ProductManager();

// Ruta para obtener los productos
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query
        };
        const products = await productManager.getAll(options);
        res.status(200).json({ status: "success", payload: products.docs, hasPrevPage: products.hasPrevPage, hasNextPage: products.hasNextPage, prevPage: products.prevPage, nextPage: products.nextPage });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.get("/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.post("/", uploader.single("thumbnail"), async (req, res) => {
    try {
        const { title, description, price, code, stock, category } = req.body;
        const thumbnail = req.file.filename;
        const newProduct = await productManager.insertOne({ title, description, price, thumbnail, code, stock, category });
        res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Ruta para obtener un producto por su ID
router.get("/:id", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Ruta para actualizar un producto por su ID
router.put("/:id", async (req, res) => {
    try {
        const product = await productManager.updateOneById(req.params.id, req.body);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Ruta para eliminar un producto por su ID
router.delete("/:id", async (req, res) => {
    try {
        await productManager.deleteOneById(req.params.id);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

export default router;