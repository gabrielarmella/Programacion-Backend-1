import multer from "multer";
import paths from "./paths.js";
import { generateNameForFile } from "./random.js";


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, paths.images);
    },
    filename: (req, file, callback) => {
        const filename = generateNameForFile(file.originalname);
        callback(null, filename);
    },
});

const fileFilter = (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Tipo de archivo no permitido");
        error.code = "LIMIT_FILE_TYPES";
        return callback(error, false);
    }
    callback(null, true);
};

const uploader = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5000000 } // Limitar el tamaño del archivo a 5MB

 });

export default uploader;