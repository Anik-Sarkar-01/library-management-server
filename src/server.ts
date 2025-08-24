import { Server } from 'http';
import app from "./app";
import mongoose from 'mongoose';

let server: Server;
const PORT = 3000;

async function main() {
    try {
        await mongoose.connect('mongodb+srv://admin-library-management:YzjENLJbhKljZyYe@cluster0.bkijc.mongodb.net/libraryManagementDB?retryWrites=true&w=majority&appName=Cluster0');

        server = app.listen(PORT, () => {
            console.log(`Library Management app listening on port ${PORT}`)
        })
    } catch (error) {
        console.log(error);
    }
}
main();