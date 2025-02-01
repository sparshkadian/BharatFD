import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import faqRouter from './routes/faqRoutes.js'
import redis from 'redis'
dotenv.config()

const app = express();
app.use(express.json())

let redisClient;

(async () => {
    try {
        redisClient = redis.createClient();
        redisClient.on("error", (error) => console.log(`Error: ${error}`));
        await redisClient.connect();
        console.log('Redis connected successfully')
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        process.exit(1)
    }
})()

mongoose.
    connect(process.env.DATABASE).
    then(() => console.log('DB connection successfull')).
    catch((err) => {
        console.log('DB connection Failed', err)
        process.exit(1)
    })

app.use('/api/faqs', faqRouter)
app.use('/*', (req, res) => {
    res.status(400).json({ message: `route ${req.originalUrl} Does not exist` })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running at Port:${PORT}`)
})

export default redisClient