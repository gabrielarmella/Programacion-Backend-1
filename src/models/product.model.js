import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: {
        type: String,
        required: [ true, "El nombre del producto es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "El nombre debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "El nombre debe tener como máximo 25 caracteres" ],
        index: { name: "idx_title" },
    },
    description: {
        type: String,
        required: [ true, "La descripcion del producto es obligatoria" ],
        trim: true,
        minLength: [ 3, "La descripcion del producto debe tener al menos 3 caracteres" ],
        maxLength: [ 300, "La descripcion debe tener como máximo 300 caracteres" ],
    },
    price: {
        type: Number,
        required: [ true, "El precio del producto es obligatorio" ],
        min: [ 0, "El precio debe ser un valor positivo" ],
    },
    thumbnail: {
        type: String,
        required: [ true, "La imagen del producto es obligatoria" ],
    },
    code: {
        type: String,
        required: [ true, "El codigo del producto es obligatorio" ],
        trim: true,
        minLength: [ 2, "El codigo debe tener al menos dos caracteres" ],
        maxLength: [ 10, "El codigo debe tener maximo diez caracteres" ],
    },
    code: {
        type: String,
        required: [ true, "El codigo del producto es obligatorio" ],
        trim: true,
        minLength: [ 2, "El codigo debe tener al menos dos caracteres" ],
        maxLength: [ 10, "El codigo debe tener maximo diez caracteres" ],
    },
    stock: {
        type: Number,
        required: [ true, "El stock del producto es obligatorio" ],
        min: [ 0, "El stock debe ser un valor positivo" ],
    },
    status: {
        type: Boolean,
        required: [ true, "El estado es obligatorio" ],
    },
    category: {
        type: String,
        required: [ true, "La categoria del producto es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "La categoria debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "La categoria debe tener como máximo 25 caracteres" ],
        index: { name: "idx_category" },
    },
}, {
    timestamps: true, 
    versionKey: false,
});

productSchema.plugin(paginate);

const ProductModel = model("products", productSchema);

export default ProductModel;