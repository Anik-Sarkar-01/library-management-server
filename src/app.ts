import express, { Application, Request, Response } from "express";
import { booksRoutes } from "./app/controllers/books.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";
const app: Application = express();
import cors from 'cors';


app.use(express.json())
app.use(cors({
    origin: ['https://library-management-client-rho-beige.vercel.app']
}))


app.use('/api/books', booksRoutes)

app.use('/api/borrow', borrowRoutes)


app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to library management app!')
})


export default app;