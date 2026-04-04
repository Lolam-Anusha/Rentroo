import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import Agency from "../models/Agency.js";
import transporter from "../config/nodemailer.js";


// internet helper
const checkAvailability = async ({car, pickUpDate, dropOffDate})=>{
    try {
        const bookings = await Booking.find({
            car,
            pickUpDate: {$lte: dropOffDate},
            dropOffDate: {$gte: pickUpDate},
        });

        const isAvailable = bookings.length === 0
        return isAvailable;
    } catch (error) {
        console.log(error.message)
    }
}

// to check car availability [post "/check-availabilty"]
export const checkBookingAvailability = async (req,res)=>{
    try {
        const {car, pickUpDate, dropOffDate} = req.body
        const isAvailable = await checkAvailability({
            car,
            pickUpDate,
            dropOffDate
        })

        res.json({success: true, isAvailable})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// create a new booking [post "/book"]
export const bookingCreate = async (req,res)=>{
    try {
        const {car, pickUpDate, dropOffDate} = req.body
        const user = req.user._id

        const isAvailable = await checkAvailability({
            car,
            pickUpDate,
            dropOffDate,
        })

        if(!isAvailable){
            return res.json({success:false, message:"Car is not available"})
        }

        // get total price from car
        const carData = await Car.findById(car).populate("agency")
        let totalPrice = carData.price.rent

        // calculate totalprice based on days
        const pickUp = new Date(pickUpDate)
        const dropOff = new Date(dropOffDate)
        const timeDiff = dropOff.getTime() - pickUp.getTime()
        const days = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)))

        totalPrice *= days

        const booking = await Booking.create({
            user,
            car,
            agency: carData.agency._id,
            pickUpDate,
            dropOffDate,
            totalPrice,
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: "Car Booking Confirmation",
            html: `
                  <h2>Your Booking Details</h2>
                  <p>Thank you for your booking! Below are your booking details:</p>
                  <ul>
                     <li><strong>Booking ID:</strong> ${booking._id}</li>
                     <li><strong>Agency Name:</strong> ${carData.agency.name}</li>
                     <li><strong>Location:</strong> ${carData.address}</li>
                     <li><strong>Date:</strong> ${booking.pickUpDate.toDateString()}-${booking.dropOffDate.toDateString()}</li>
                     <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || "$"}${booking.totalPrice} for ${days} days</li>
                  </ul>
                  <p>We are excited to welcome you soon.</p>
                  <p>Need to change something? Contact us.</p>    
                  `
        };

        await transporter.sendMail(mailOptions)

        res.json({success:true, message:"Booking Created"})
    } catch (error) {
        res.json({success:true, message: error.message})
    }
}

// get bookings of current user [get "/user"]
export const getUserBookings = async (req,res)=>{
    try {
        const user = req.user._id
        const bookings = await Booking.find({user}).populate("car agency").sort({createdAt: -1})

        res.json({success:true, bookings})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// get bookings for agency [get '/agency']
export const getAgencyBookings = async (req,res)=>{
    try {
        const agency = await Agency.findOne({owner: req.user._id})
        if(!agency){
            return res.json({success:false, message: "No Agency found"})
        }

        const bookings = await Booking.find({agency: agency._id}).populate("car agency user").sort({createdAt: -1})
        const totalBookings = bookings.length
        const totalRevenue = bookings.reduce((acc, b)=> acc + (b.isPaid ? b.totalPrice: 0), 0)

        res.json({success:true, dashboardData: {totalBookings, totalRevenue, bookings}})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}
