"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./app/controllers/books.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['https://library-management-client-rho-beige.vercel.app']
}));
app.use('/api/books', books_controller_1.booksRoutes);
app.use('/api/borrow', borrow_controller_1.borrowRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to library management app!');
});
exports.default = app;
