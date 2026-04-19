// connect to database
const mongoose = require("mongoose");

main().catch(err => console.log("❌ MongoDB Connection Error:", err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Database Connected");
}