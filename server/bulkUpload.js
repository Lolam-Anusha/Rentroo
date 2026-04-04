import mongoose from "mongoose"
import "dotenv/config"
import { v2 as cloudinary } from "cloudinary"
import Car from "./models/Car.js"
import Agency from "./models/Agency.js"
import User from "./models/User.js"
import path from "path"
import { fileURLToPath } from "url"
import { features } from "process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLDN_NAME,
    api_key: process.env.CLDN_API_KEY,
    api_secret: process.env.CLDN_API_SECRET,
})

const dummyCars = [
    {
        "_id": "67f7647c197ac559e4089b96",
        "agency": "",
        "title": "Porsche 911 Carrera",
        "description": "Two-door sport coupe with sharp handling, responsive turbocharged engine, and a driver focused cockpit. Suited for spirited drives and short trips with premium materials and modern connectivity.",
        "address": "789 Park Lane, New York, USA",
        "city": "New York",
        "country": "USA",
        "bodyType": "Coupe",
        "price": { "rent": 299, "sale": 33000 },
        "specs": { "transmission": "Manual", "seats": 2, "fuelType": "Petrol" },
        "odometer": 12500,
        "features": ["Rear Camera", "Apple CarPlay", "Keyless Entry", "Adaptive Cruise", "Heated Seats", "Sunroof"],
        "images": ["img1.png", "cImg2.png", "cImg3.png", "cImg4.png"],
        "isAvailable": true,
    },
    {
        "_id": "67f76452197ac559e4089b8e",
        "agency": "",
        "title": "Lamborghini Urus",
        "description": "Mid-size SUV with robust chassis, elevated ride height, and all-wheel capability. Practical interior, large cargo area, and modern driver aids for family trips and mixed road conditions.",
        "address": "301 Sunset Boulevard, Los Angeles, USA",
        "city": "Los Angeles",
        "country": "USA",
        "bodyType": "SUV",
        "price": { "rent": 599, "sale": 29000 },
        "specs": { "transmission": "Automatic", "seats": 5, "fuelType": "Electric" },
        "odometer": 46000,
        "features": ["Rear Camera", "Keyless Entry", "Adaptive Cruise", "Sunroof", "Parking Assist", "Cruise Control"],
        "images": ["img2.png", "cImg3.png", "cImg4.png", "cImg2.png"],
        "isAvailable": true,
    },
    {
        "_id": "67f76406197ac559e4089b82",
        "agency": "",
        "title": "Audi RS3 Sportback",
        "description": "Compact hatchback built for efficient city driving, easy parking, and low running costs. Agile steering and good fuel economy with practical cargo flexibility.",
        "address": "900 Bay Street, Toronto, Canada",
        "city": "Toronto",
        "country": "Canada",
        "bodyType": "Hatchback",
        "price": { "rent": 299, "sale": 19000 },
        "specs": { "transmission": "Manual", "seats": 5, "fuelType": "Diesel" },
        "odometer": 18500,
        "features": ["Apple CarPlay", "Keyless Entry", "Adaptive Cruise", "Heated Seats", "Parking Assist", "Rear Camera"],
        "images": ["img3.png", "cImg4.png", "cImg3.png", "cImg2.png"],
        "isAvailable": true,
    },
    {
        "_id": "67f763d8197ac559e4089b7a",
        "agency": "",
        "title": "Mercedes-Benz S 500",
        "description": "Four-door executive sedan focused on comfort and refinement. Smooth ride, spacious rear seating, advanced safety features, and premium cabin materials for long-distance comfort.",
        "address": "29 Alexanderplatz, Berlin, Germany",
        "city": "Berlin",
        "country": "Germany",
        "bodyType": "Sedan",
        "price": { "rent": 399, "sale": 33000 },
        "specs": { "transmission": "Automatic", "seats": 5, "fuelType": "Electric" },
        "odometer": 29500,
        "features": ["Adaptive Cruise", "Heated Seats", "Sunroof", "Parking Assist", "Cruise Control", "Apple CarPlay"],
        "images": ["img4.png", "cImg2.png", "cImg3.png", "cImg4.png"],
        "isAvailable": true,
    },
    {
        "_id": "67f7663b197ac559e4089bb8",
        "agency": "",
        "title": "Porsche Taycan Turbo S",
        "description": "All-electric performance sedan offering instant torque, precise handling, and luxurious cabin comfort. Ideal for buyers seeking EV performance without sacrificing refinement.",
        "address": "1 Palm Jumeirah, Abu Dhabi, UAE",
        "city": "Abu Dhabi",
        "country": "UAE",
        "bodyType": "Sedan",
        "price": { "rent": 499, "sale": 35000 },
        "specs": { "transmission": "Automatic", "seats": 4, "fuelType": "Hybrid" },
        "odometer": 12000,
        "features": ["Rear Camera", "Apple CarPlay", "Keyless Entry", "Adaptive Cruise", "Sunroof", "Parking Assist"],
        "images": ["img8.png", "cImg2.png", "cImg4.png", "cImg3.png"],
        "isAvailable": true,
    },
    {
        "_id": "67f765aa197ac559e4089b9c",
        "agency": "",
        "title": "Porsche 718 Boxster",
        "description": "Convertible with a refined chassis and retractable top for open-air driving. Comfortable seating for four, responsive handling, and modern infotainment for weekend drives.",
        "address": "1 Palm Jumeirah, Abu Dhabi, UAE",
        "city": "Abu Dhabi",
        "country": "USA",
        "bodyType": "Convertible",
        "price": { "rent": 499, "sale": 44000 },
        "specs": { "transmission": "Automatic", "seats": 4, "fuelType": "Electric" },
        "odometer": 22500,
        "features": ["Parking Assist", "Cruise Control", "Rear Camera", "Apple CarPlay", "Keyless Entry", "Heated Seats"],
        "images": ["img5.png", "cImg3.png", "cImg2.png", "cImg4.png"],
        "isAvailable": true,
    },
    {
        "_id": "67f765f4197ac559e4089ba4",
        "agency": "",
        "title": "Mercedes-Benz Sprinter 3500",
        "description": "Utility cargo van designed for trades and deliveries. Large load area, durable interior surfaces, practical access points, and reliable mechanicals for daily work.",
        "address": "88 Willow Lane, Edinburgh, UK",
        "city": "Edinburgh",
        "country": "UK",
        "bodyType": "Van",
        "price": { "rent": 199, "sale": 22000 },
        "specs": { "transmission": "Dual-clutch", "seats": 3, "fuelType": "Petrol" },
        "odometer": 76000,
        "features": ["Rear Camera", "Keyless Entry", "Apple CarPlay", "Parking Assist", "Adaptive Cruise", "Cruise Control"],
        "images": ["img6.png", "cImg2.png", "cImg3.png", "cImg4.png"],
        "isAvailable": true,
        "status": "available",
    },
    {
        "_id": "67f7660a197ac559e4089bb0",
        "agency": "",
        "title": "Lamborghini Huracán EVO",
        "description": "High-revving V10 supercar with razor-sharp handling, lightweight chassis, and premium sporty interior. Built for high-performance driving and track-capable bursts on demand.",
        "address": "10 King's Road, London, UK",
        "city": "London",
        "country": "UK",
        "bodyType": "Coupe",
        "price": { "rent": 1200, "sale": 44000 },
        "specs": { "transmission": "Dual-clutch", "seats": 2, "fuelType": "Diesel" },
        "odometer": 8500,
        "features": ["Rear Camera", "Adaptive Cruise", "Heated Seats", "Sunroof", "Apple CarPlay", "Keyless Entry"],
        "images": ["img7.png", "cImg3.png", "cImg4.png", "cImg2.png"],
        "isAvailable": true,
    },
    {
        "_id": "67f7666c197ac559e4089bc0",
        "agency": "",
        "title": "Ferrari F8 Tributo",
        "description": "Mid-engine V8 supercar delivering blistering acceleration and sublime handling. Driver-focused cockpit with premium materials and race-bred technology for an exhilarating experience.",
        "address": "10 Avenue Princesse Grace, Monaco",
        "city": "Monaco",
        "country": "Monaco",
        "bodyType": "Coupe",
        "price": { "rent": 1400, "sale": 88000 },
        "specs": { "transmission": "Automatic", "seats": 2, "fuelType": "Petrol" },
        "odometer": 7000,
        "features": ["Rear Camera", "Parking Assist", "Adaptive Cruise", "Apple CarPlay", "Keyless Entry", "Cruise Control"],
        "images": ["img9.png", "cImg3.png", "cImg4.png", "cImg2.png"],
        "isAvailable": true,
    },
    {
        "_id": "67f7669d197ac559e4089bc8",
        "agency": "",
        "title": "McLaren 720S",
        "description": "Lightweight carbon-fiber supercar with a twin-turbo V8, blistering acceleration, and razor-sharp handling. Designed for both road and occasional track use with driver-focused ergonomics.",
        "address": "22 Via dei Condotti, Rome, Italy",
        "city": "Rome",
        "country": "Italy",
        "bodyType": "Coupe",
        "price": { "rent": 1300, "sale": 72000 },
        "specs": { "transmission": "Manual", "seats": 2, "fuelType": "Petrol" },
        "odometer": 6200,
        "features": ["Rear Camera", "Apple CarPlay", "Adaptive Cruise", "Heated Seats", "Sunroof", "Cruise Control"],
        "images": ["img10.png", "cImg4.png", "cImg3.png", "cImg2.png"],
        "isAvailable": true,
    },
    {
        "_id": "67f766cf197ac559e4089bd0",
        "agency": "",
        "title": "Aston Martin DB11",
        "description": "Grand tourer combining refined luxury with potent V8/V12 performance. Smooth long-distance cruising, handcrafted interior, and advanced stability for comfortable high-speed touring.",
        "address": "5 Piccadilly, London, UK",
        "city": "London",
        "country": "UK",
        "bodyType": "Grand Tourer",
        "price": { "rent": 650, "sale": 89000 },
        "specs": { "transmission": "Automatic", "seats": 4, "fuelType": "Hybrid" },
        "odometer": 14000,
        "features": ["Rear Camera", "Apple CarPlay", "Heated Seats", "Adaptive Cruise", "Parking Assist", "Cruise Control"],
        "images": ["img11.png", "cImg3.png", "cImg4.png", "img2.png"],
        "isAvailable": true,
    },
];


async function bulkUpload() {
    try {
        // connect to MongoDb
        await mongoose.connect(`${process.env.MONGO_URI}/Rentroo`);
        
        // 1.get logged-in agent (owner) from DB
        // replacing this with actual owner ID if known, or query by email
        const owner = await User.findOne({ role: "agencyOwner "});
        if(!owner) throw new Error("No agencyOwner found in DB");

        // 2.get agency owned by this user
        const agency = await Agency.findOne({ owner: owner._id});
        if(!agency) throw new Error("No agency found for this owner");

        console.log(`Using Agency: ${agency.name} | Owner: ${owner.username}`);

        for(const car of dummyCars){
            // upload images to cloudinary
            const imagesUrl = await Promise.all(
                car.images.map(async (fileName) => {
                    const filePath = path.join(__dirname, "images", fileName);
                    const result = await cloudinary.uploader.upload(filePath);
                    return result.secure_url;
                })
            );

            // create car with real agency reference
            await Car.create({
                agency: agency._id,
                title: car.title,
                description: car.description,
                city: car.city,
                country: car.country,
                address: car.address,
                odometer: Number(car.odometer) || 0,
                bodyType: car.bodyType,
                price: {
                    rent: car.price?.rent ? Number(car.price.rent) : null,
                    sale: car.price?.sale ? Number(car.price.sale) : null,
                },
                specs: {
                    transmission: car.specs?.transmission || "Unknown",
                    seats: Number(car.specs?.seats || 1),
                    fuelType: car.specs?.fuelType || "Unknown",
                },
                features: Array.isArray(car.features) ? car.features : [],
                images: imagesUrl,
                isAvailable: !!car.isAvailable,
            })

            console.log(`Uploaded: ${car.title}`);
        }
        console.log("All cars uploaded successfully!")

    } catch (err) {
        console.error("Error:", err.message || err);
    } finally {
        await mongoose.disconnect()
    }
}

bulkUpload()