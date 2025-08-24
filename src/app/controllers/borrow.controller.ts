import express, { Request, Response } from "express";
import { Borrow } from "../models/borrow.model";
import { z } from "zod";

export const borrowRoutes = express.Router();

const CreateBorrowZodSchema = z.object(
    {
        book: z.string(),
        quantity: z.number().int(),
        dueDate: z.coerce.date().refine(
            (date) => date > new Date(),
            { message: "Due date should be in the future" }
        )
    }
)

// create Borrow
borrowRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const { book, quantity, dueDate } = await CreateBorrowZodSchema.parseAsync(req.body);

        await Borrow.processBorrow(book, quantity);

        const borrow = await Borrow.create({ book, quantity, dueDate });

        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow
        })
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to borrow",
            success: false,
            error: error
        })
    }
})

// get all borrow
borrowRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const summary = await Borrow.aggregate([
            { $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } } },

            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },

            { $unwind: "$bookDetails" },

            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn",
                    },
                    totalQuantity: 1
                }
            }
        ])

        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary
        })
    } catch (error : any) {
        res.status(400).json({
            message: error.message || "Failed to generate summary",
            success: false,
            error: error
        })
    }
})


