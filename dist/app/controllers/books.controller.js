"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
const zod_1 = require("zod");
exports.booksRoutes = express_1.default.Router();
const createBooksZodSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.string(),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().int(),
    available: zod_1.z.boolean().optional()
});
// create book
exports.booksRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield createBooksZodSchema.parseAsync(req.body);
        const book = yield books_model_1.Book.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to create the book",
            success: false,
            error: error
        });
    }
}));
// get all books
// /app/books
// /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5
exports.booksRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "asc", limit = "10" } = req.query;
        const genreFilter = filter ? { genre: filter } : {};
        const sortOrder = sort === "asc" ? 1 : -1;
        const resultLimit = parseInt(limit) || 10;
        const books = yield books_model_1.Book.find(genreFilter)
            .sort({ [sortBy]: sortOrder })
            .limit(resultLimit);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to retrieve books",
            success: false,
            error: error
        });
    }
}));
// get a book by id
exports.booksRoutes.get('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const book = yield books_model_1.Book.findById(id);
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to retrieve the book",
            success: false,
            error: error
        });
    }
}));
// update a book by id
exports.booksRoutes.put('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const updatedBody = req.body;
        if (updatedBody.copies !== undefined) {
            updatedBody.available = updatedBody.copies > 0;
        }
        const book = yield books_model_1.Book.findByIdAndUpdate(id, updatedBody, { new: true });
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to update the book",
            success: false,
            error: error
        });
    }
}));
// delete a book by id
exports.booksRoutes.delete('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const book = yield books_model_1.Book.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to delete the book",
            success: false,
            error: error
        });
    }
}));
