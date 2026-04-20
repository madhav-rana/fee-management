require("dotenv").config();

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo").default;
const ExpressError = require("./utils/ExpressError");
const methodOverride = require('method-override');



// Route Imports 
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const feeRoutes = require("./routes/feeStructureRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
// const MONGO_URL = process.env.MONGO_URL;
// main().catch(err => console.log("MongoDB Connection Error:", err));
// async function main() {
//   await mongoose.connect(MONGO_URL);
//   console.log("✅ Database Connected");
// }
require("./config/database")

// View Engine Setup 
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// app.use(session({
//   name: "admin-session",
//   secret: process.env.SECRET || "fallback-secret",
//   resave: false,
//   saveUninitialized: false
// }));

app.use(session({
  name: "admin-session",

  secret: process.env.SECRET,

  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions"
  }),

  cookie: {
    maxAge: 1000 * 60 * 30, // 30 minutes
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "strict"
  }
}));

// Flash middleware
app.use(flash());

// Local Variables Middleware
app.use((req, res, next) => {
  // res.locals.isAuthenticated = !!req.session.adminId;
  res.locals.isAuthenticated = !!req.session.admin;
  res.locals.admin = req.session.admin || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


// Routes
app.get("/", (req, res) => res.render("home"));
app.get("/portal", (req, res) => res.render("index"));
app.get("/contact", (req, res) => res.render("contact"));

// API Routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/fees", feeRoutes);



// Catch-all for unknown routes (handle all invalid routes)
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "❌Page Not Found"));
});


app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;

  res.status(statusCode).render("error.ejs", {
    status: statusCode,
    message,
    error: process.env.NODE_ENV !== "production" ? err : {}
  });
});


app.listen(PORT, () => console.log(` Server running on port ${PORT}`));