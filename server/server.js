import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js"

// establish connect to database
await connectDB()

const app = express() 
app.use(cors())

// middelware setup
app.use(express.json())

app.use(clerkMiddleware())

// API to listen clerk webhooks
app.use("/api/clerk", clerkWebhooks)

// ROute end point to check API status
app.get('/', (req,res)=>res.send("API Successfully Connected"))

const port = process.env.PORT || 4000

// start the server
app.listen(port, ()=> console.log(`Server is running at http://localhost:${port}`))