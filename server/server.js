import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js"
import userRouter from "./routes/userRoute.js"
import agencyRouter from "./routes/agencyRoute.js"
import connectCloudinary from "./config/cloudinary.js"
import carRouter from "./routes/carRoute.js"
import bookingRouter from "./routes/bookingRoute.js"

// establish connect to database
await connectDB()
// setup cloudinary for image storage
await connectCloudinary()

const app = express() 
app.use(cors())

// ✅ Webhook route FIRST
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
)

// other middleware AFTER
app.use(express.json())
app.use(clerkMiddleware())

// define API routes
app.use('/api/user', userRouter)
app.use('/api/agencies', agencyRouter)
app.use('/api/cars', carRouter)
app.use('/api/bookings', bookingRouter)


// ROute end point to check API status
app.get('/', (req,res)=>res.send("API Successfully Connected"))

const port = process.env.PORT || 4000

// start the server
app.listen(port, ()=> console.log(`Server is running at http://localhost:${port}`))