import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { User } from "../modules/users/user.model";
import { PendingRegistration } from "../modules/auth/pendingRegistration.model";

const run = async () => {
  await connectDB();

  await User.createIndexes();
  await PendingRegistration.createIndexes();

  console.log("Auth indexes created or already present");
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(
    "Failed to create auth indexes:",
    error instanceof Error ? error.message : "Unknown error"
  );

  await mongoose.disconnect();
  process.exitCode = 1;
});
