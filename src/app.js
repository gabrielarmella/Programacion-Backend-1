import express from "express";

import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
// Se crea una instancia de la aplicación Express
const app = express();

// Se define el puerto en el que el servidor escuchará las solicitudes
const PORT = 8080;

// Middleware para acceder al contenido de formularios codificados en URL
app.use(express.urlencoded({ extended: true }));


// Middleware para acceder al contenido JSON de las solicitudes
app.use(express.json());

app.use("/api/public", express.static("./src/public"));

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

// Se levanta el servidor oyendo en el puerto definido
app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);

});