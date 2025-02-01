import express from 'express'
import dotenv from 'dotenv'
import mongoose, { mongo } from 'mongoose';
dotenv.config()

const app = express();

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.DATABASE).then(() => console.log('DB connection successfull')).catch(() => console.log('DB connection Failed'))

app.listen(PORT, () => {
    console.log(`Server is running at Port:${PORT}`)
})

