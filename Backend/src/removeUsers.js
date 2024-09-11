import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";
import { UnRegisteredUser } from "./models/unRegisteredUser.model.js";

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${'mongodb+srv://admin-ashish:hotel9ervictor@web-test-projects.bwuoqdk.mongodb.net'}/${"SkillSwap"}`
        );
        console.log(
            `\n MongoDB connected: ${connectionInstance.connection.host} \n`
        );
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1);
    }
};

// Function to remove all users
const removeAllUsers = async () => {
    try {
        const result = await User.deleteMany({});
        console.log(`Removed ${result.deletedCount} users`);
    } catch (error) {
        console.error("Error removing users: ", error);
    }
};

// Function to remove all users
const removeAllUnregisteredUsers = async () => {
    try {
        const result = await UnRegisteredUser.deleteMany({});
        console.log(`Removed ${result.deletedCount} users`);
    } catch (error) {
        console.error("Error removing users: ", error);
    }
};

// Connect to the database and remove all users
const runCleanup = async () => {
    await connectDB();
    await removeAllUsers();
    await removeAllUnregisteredUsers();
    mongoose.disconnect();
};

runCleanup();
