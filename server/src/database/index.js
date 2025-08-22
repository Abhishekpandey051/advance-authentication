// connection to the mongoDB database
import mongoose from "mongoose";
import { DB_NAME } from "../../constant.js";

const connectDB = async () => {
  try {
    const res = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n Mongodb connected !! DB HOST ${res.connection.host}`);
  } catch (err) {
    console.log("MONGODB connection failed", err);
    process.exit(1);
  }
};

export default connectDB;
