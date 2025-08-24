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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const books_model_1 = require("./books.model");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, "Book (borrowed book ID) is required."]
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required.'],
        min: [1, 'Quantity must be at least 1, got {VALUE}']
    },
    dueDate: {
        type: Date,
        required: [true, 'DueDate is required.']
    }
}, {
    versionKey: false,
    timestamps: true,
});
borrowSchema.static("processBorrow", function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield books_model_1.Book.findById(bookId);
        if (!book) {
            const err = new Error("Book not found");
            err.name = "NotFoundError";
            throw err;
        }
        if (book.copies < quantity) {
            const err = new Error(`Only ${book.copies} copies available, but ${quantity} requested.`);
            err.name = "ValidationError";
            throw err;
        }
        book.copies -= quantity;
        if (book.copies === 0) {
            book.available = false;
        }
        yield book.save();
    });
});
// Pre-save hook
borrowSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Borrow record is about to be validated and saved:", this);
        const exists = yield books_model_1.Book.exists({ _id: this.book });
        if (exists) {
            console.log("Book reference validated:", this.book);
        }
        next();
    });
});
// Post-save hook 
borrowSchema.post("save", function (doc) {
    console.log("Borrow record saved:", doc._id);
});
// Before finding
borrowSchema.pre("find", function (next) {
    console.log("About to run find query:");
    next();
});
// after finding
borrowSchema.post("find", function (docs) {
    console.log("Found Records:", docs.length);
});
exports.Borrow = (0, mongoose_1.model)('Borrow', borrowSchema);
