import express from "express";
import { connectDB } from "./config/mongoose.config.js";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
//Importacion de enrutadores
import routerCarts from "./routes/cart.router.js";
import routerProducts from "./routes/products.router.js";
import routerViewHome from "./routes/home.view.router.js";

// Se crea una instancia de la aplicación Express
const app = express();

// Se define el puerto en el que el servidor escuchará las solicitudes
const PORT = 8080;

// Conexión con la Base de Datos del Cloud de MongoDB
connectDB();


app.use("/api/public", express.static("./src/public"));

// Middleware para acceder al contenido de formularios codificados en URL
app.use(express.urlencoded({ extended: true }));

// Middleware para acceder al contenido JSON de las solicitudes
app.use(express.json());

//Configuracion del motor de plantillas
configHandlebars(app);


// Declaración de rutas
app.use("/api/carts", routerCarts);
app.use("/api/products", routerProducts);
app.use("/", routerViewHome);

// Se levanta el servidor oyendo en el puerto definido
const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

// Configuración del servidor de websocket
configWebsocket(httpServer);