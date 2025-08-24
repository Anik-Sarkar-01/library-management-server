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
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("../models/borrow.model");
const zod_1 = require("zod");
exports.borrowRoutes = express_1.default.Router();
const CreateBorrowZodSchema = zod_1.z.object({
    book: zod_1.z.string(),
    quantity: zod_1.z.number().int(),
    dueDate: zod_1.z.coerce.date().refine((date) => date > new Date(), { message: "Due date should be in the future" })
});
// create Borrow
exports.borrowRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = yield CreateBorrowZodSchema.parseAsync(req.body);
        yield borrow_model_1.Borrow.processBorrow(book, quantity);
        const borrow = yield borrow_model_1.Borrow.create({ book, quantity, dueDate });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to borrow",
            success: false,
            error: error
        });
    }
}));
// get all borrow
exports.borrowRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
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
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to generate summary",
            success: false,
            error: error
        });
    }
}));
