import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Event listeners for connection
        mongoose.connection.on('connected', () => {
            console.log("✅ DB Connected Successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error("❌ DB Connection Error:", err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("⚠️  DB Disconnected");
        });

        // Connect to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        console.error("Please check your MONGODB_URI in .env file");
        console.error("Server will continue running but database operations will fail");
        // Don't exit the process - let the server run for testing
    }
}

export default connectDB;
