import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/connect.js";

dotenv.config({
  path: './.env'
})

connectDB()
.then(() => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log("Server listening on:", PORT);
  })
})
.catch((error) => {
  console.log("Something went wrong while creating DB!", error.message);
})
