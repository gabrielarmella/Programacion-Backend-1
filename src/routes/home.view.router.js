import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();


router.get("/", async (req, res) => {
    try {
        res.render("home", { title: "Inicio" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});
router.get("/products", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const products = await productManager.getAll({ page });
        res.render("index", { products: products.docs, hasPrevPage: products.hasPrevPage, hasNextPage: products.hasNextPage, prevPage: products.prevPage, nextPage: products.nextPage });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params.pid);
        res.render("productDetails", { product });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getOneById(req.params.cid);
        res.render("cart", { cart });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router;