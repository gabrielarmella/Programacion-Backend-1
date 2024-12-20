import { Router } from "express";
import CartManager from "../manager/CartManager.js"; 

const router = Router();
const cartManager = new CartManager();

router.get("/detail", async (req, res) => {
    try {
        const { limit, page, title, sort } = req.query;
        const carts = await cartManager.getAll({ limit, page, title, sort });

        if (!carts.docs || carts.docs.length === 0) {
            throw new Error("No hay carritos disponibles.");
        }

        console.log(carts);
        res.status(200).render("viewCart", {title: "Carrito de compras", carts,  query: req.query,
        });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
});

export default router;