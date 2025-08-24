import { model, Schema, Types } from "mongoose";
import { BorrowStaticMethods, IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./books.model";

const borrowSchema = new Schema<IBorrow, BorrowStaticMethods>({
    book: {
        type: Schema.Types.ObjectId,
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
})

borrowSchema.static("processBorrow", async function (
    bookId: Types.ObjectId,
    quantity: number
) {
    const book = await Book.findById(bookId);
    if (!book) {
        const err = new Error("Book not found");
        err.name = "NotFoundError";
        throw err;
    }

    if (book.copies < quantity) {
        const err = new Error(
            `Only ${book.copies} copies available, but ${quantity} requested.`
        );
        err.name = "ValidationError";
        throw err;
    }

    book.copies -= quantity;

    if (book.copies === 0) {
        book.available = false;
    }

    await book.save();
});


// Pre-save hook
borrowSchema.pre("save", async function (next) {
    console.log("Borrow record is about to be validated and saved:", this);
    const exists = await Book.exists({ _id: this.book })
    if (exists) {
        console.log("Book reference validated:", this.book);
    }
    next();
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


export const Borrow = model<IBorrow, BorrowStaticMethods>('Borrow', borrowSchema);