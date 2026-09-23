import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    const targetDbName = process.env.DB_NAME || DB_NAME || "ricoz_respond_testing";

    const connectionInstance = await mongoose.connect(mongoUri, {
      dbName: targetDbName
    });
    console.log(
      `\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}, Database: ${targetDbName}`
    );
    return connectionInstance;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;

