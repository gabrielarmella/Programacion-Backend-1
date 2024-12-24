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
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: async function (code) {
                const countDocuments = await this.model("products").countDocuments({
                    _id:{ $ne: this._id },
                    code,
                });
                return countDocuments===0;
            },
            message: "El código ya está registrado",
        },
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
        trim: true,
        minLength: [ 3, "La categoría debe tener al menos 3 caracteres" ],
        maxLength: [ 15, "La categoría debe tener como máximo 15 caracteres" ],
    },
}, {
    timestamps: true, 
    versionKey: false,
});

productSchema.plugin(paginate);

const ProductModel = model("products", productSchema);

export default ProductModel;