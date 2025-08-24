import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { z } from "zod";

export const booksRoutes = express.Router();

const createBooksZodSchema = z.object(
    {
        title: z.string(),
        author: z.string(),
        genre: z.string(),
        isbn: z.string(),
        description: z.string().optional(),
        copies: z.number().int(),
        available: z.boolean().optional()
    }
)

// create book
booksRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const body = await createBooksZodSchema.parseAsync(req.body);
        const book = await Book.create(body);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        })

    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to create the book",
            success: false,
            error: error
        })
    }
})

// get all books
// /app/books
// /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5
booksRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const { filter, sortBy = "createdAt", sort = "asc", limit = "10" } = req.query;
        const genreFilter = filter ? { genre: filter } : {};
        const sortOrder = sort === "asc" ? 1 : -1;
        const resultLimit = parseInt(limit as string) || 10;
        const books = await Book.find(genreFilter)
            .sort({ [sortBy as string]: sortOrder })
            .limit(resultLimit);

        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to retrieve books",
            success: false,
            error: error
        })
    }
})

// get a book by id
booksRoutes.get('/:bookId', async (req: Request, res: Response) => {
    try {
        const id = req.params.bookId;
        const book = await Book.findById(id);

        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to retrieve the book",
            success: false,
            error: error
        })
    }
})

// update a book by id
booksRoutes.put('/:bookId', async (req: Request, res: Response) => {
    try {
        const id = req.params.bookId;
        const updatedBody = req.body;

        if (updatedBody.copies !== undefined) {
            updatedBody.available = updatedBody.copies > 0;
        }

        const book = await Book.findByIdAndUpdate(id, updatedBody, { new: true });

        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data: book
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to update the book",
            success: false,
            error: error
        })
    }
})

// delete a book by id
booksRoutes.delete('/:bookId', async (req: Request, res: Response) => {
    try {
        const id = req.params.bookId;
        const book = await Book.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to delete the book",
            success: false,
            error: error
        })
    }
})