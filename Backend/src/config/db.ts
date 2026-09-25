import mongoose from "mongoose"

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI as string
    await mongoose.connect(uri)
    console.log("MongoDB connected")
    console.log("Database name:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection failed:", error)
    process.exit(1)
  } 
}
