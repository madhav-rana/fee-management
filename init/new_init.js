const mongoose = require("mongoose");
const Branch = require("../models/branch.model");
const FeeStructure = require("../models/feeStructure.model");
const Student = require("../models/student.model");
const Payment = require("../models/payment.model");

const MONGO_URI = "mongodb://127.0.0.1:27017/sid";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected for seeding"))
  .catch(err => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

async function seedData() {
  try {
    // 🧹 Clear old data
    await Payment.deleteMany({});
    await Student.deleteMany({});
    await FeeStructure.deleteMany({});
    await Branch.deleteMany({});
    console.log("🧹 Database cleared");

    // 1️⃣ Branches
    const branches = await Branch.insertMany([
      { code: "cse", name: "Computer Science Engineering" },
      { code: "me", name: "Mechanical Engineering" },
      { code: "ee", name: "Electrical Engineering" },
      { code: "ece", name: "Electronics Engineering" },
      { code: "civil", name: "Civil Engineering" },
      { code: "ic", name: "Instrumentation & Control Engineering" },
      { code: "ip", name: "Industrial & Production Engineering" }
    ]);
    console.log("✅ Branches seeded");

    // 2️⃣ ONE Fee Structure
    const breakdown = {
      tuition: 55000,
      cautionMoney: 5000,
      exam: 7500,
      activity: 3000,
      hostel: 22500,
      others: 365
    };

    // const totalAmount = Object.values(breakdown).reduce((a, b) => a + b, 0);

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 3);

    const feeStructure = await FeeStructure.create({
      academicYear: "2026-2027",
      course: "BTECH",
      breakdown,
      hostelFee: 20000,
      dueDate: dueDate,
      finePerWeek: 100
      //totalAmount
    });

    console.log("✅ FeeStructure seeded");

    // 3️⃣ Generate 57 students (7 fixed + 50 random)
    const firstNames = [
      "Aarav","Vivaan","Aditya","Sai","Arjun","Krishna","Rohan",
      "Reyansh","Vihaan","Ansh","Kabir","Ishaan","Aryan"
    ];
    const lastNames = [
      "Sharma","Verma","Gupta","Singh","Mehta","Kapoor",
      "Patel","Jain","Reddy","Nair"
    ];

    function randomItem(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function randomPhone() {
      return `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    }

    const students = [];

    for (let i = 1; i <= 57; i++) {
      const first = randomItem(firstNames);
      const last = randomItem(lastNames);

      students.push({
        name: `${first} ${last}`,
        rollNo: `BT2025-${String(i).padStart(3, "0")}`,
        course: "BTECH",
        branch: randomItem(branches)._id,
        // year: Math.floor(Math.random() * 4) + 1,
        year: 1,
        contactNumber: randomPhone(),
        email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@mail.com`,
        address: "Sample Address, Uttar Pradesh",
        feeStructure: feeStructure._id
      });
    }

    await Student.insertMany(students);
    console.log(`✅ ${students.length} students seeded`);

    console.log("\n🎉 SEEDING COMPLETED SUCCESSFULLY");
    // console.log(`💰 Fee per student: ₹${totalAmount}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedData();
