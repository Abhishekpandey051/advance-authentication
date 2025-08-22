import dotenv from "dotenv";
import connectDB from "./src/database/index.js";
import { app } from "./src/app.js";

dotenv.config();
const port  = process.env.PORT || 5000;

connectDB().then(() => {
    app.on('error', (err) => {
        console.log("Error in runing server", err)
    })
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    })
})
.catch((err) => {
    console.log("MomgoDB connection failed ", err);
})