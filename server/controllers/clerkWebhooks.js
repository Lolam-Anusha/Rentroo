import User from "../models/User.js";
import { Webhook } from "svix"

const clerkWebhooks = async (req, res) => {
    try {
        console.log("Webhook hit")
        // Creating a svix instance
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        // GET Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        }

        // verifying headers
        await whook.verify(req.body, headers)

        const { data, type } = JSON.parse(req.body.toString())

        console.log("Event Type:", type)

        // switch cases for different events
        switch (type) {
            case "user.created": {
                console.log("Inside user.created")

                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "test@example.com",
                    username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                };

                console.log("User Data:", userData)

                const newUser = await User.create(userData)

                console.log("Saved User:", newUser)

                break;
            }

            case "user.updated": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData)
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id)
                break;
            }

            default:
                break;
        }

        res.json({ success: true, message: "Webhook Received" })

    } catch (error) {
        console.log("Webhook error", error.message)
        res.status(400).json({ success: false, message: error.message })
    }
}

export default clerkWebhooks