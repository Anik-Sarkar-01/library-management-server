import { model, Schema } from "mongoose";
import { IBooks } from "../interfaces/books.interface";


const BookSchema = new Schema<IBooks>({
    title: {
        type: String,
        required: [true, "Title is required."],
        trim: true,
    },
    author: {
        type: String,
        required: [true, "Author is required."],
        trim: true
    },
    genre: {
        type: String,
        uppercase: true,
        enum: {
            values: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
            message: '{VALUE} is not supported.'
        },
        required: [true, 'Genre is required.'],
        trim: true
    },
    isbn: {
        type: String,
        required: [true, "ISBN is required."],
        unique: true,
        trim:true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
    },
    copies: {
        type: Number,
        min: [0, 'Must be at least 0, got {VALUE}'],
        required: [true, "Total Number of copies is required."]
    },
    available: {
        type: Boolean,
        default: true
    },
}, {
    versionKey: false,
    timestamps: true
});

export const Book = model<IBooks>('Book', BookSchema);
