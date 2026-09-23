import "dotenv/config";
import connectDB from "./db/db.js";
import { app } from "./app.js";


const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Atlas connection failed:", error);
    process.exit(1);
  });
