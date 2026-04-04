import User from "../models/User.js"
import { clerkClient } from "@clerk/express"

export const authUser = async (req, res, next) => {
    try {
        const { userId } = req.auth()

        if (!userId) {
            return res.json({ success: false, message: "Not Authorized" })
        }

        let user = await User.findById(userId)

        // FIX: If user has a valid Clerk token but doesn't exist in MongoDB yet
        // (webhook may have been delayed or failed), fetch from Clerk and auto-create them
        if (!user) {
            const clerkUser = await clerkClient.users.getUser(userId)

            user = await User.create({
                _id: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress || "",
                username: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                image: clerkUser.imageUrl || "",
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}