import mongoose from "mongoose"

const connectDB = async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/Rentroo`)
        console.log("Database Connected")
    } catch(error) {
        console.log("Database Connection Failed", error.message)
    }
}

export default connectDB