# College Fee Management System

A full-stack web application for managing college fee collection, payment processing, and analytical reporting. Built with Node.js, Express.js, and MongoDB.

---

## Features

- **Online Payment** via Razorpay (UPI, card, net banking)
- **Background Job Queue** using Bull + Redis for async PDF generation, Cloudinary upload, and email delivery
- **Automated Receipt** — PDF generated, uploaded to Cloudinary, emailed to student after every payment
- **OTP-based Admin Auth** with session management and password reset
- **Student Management** — individual add and bulk CSV upload with duplicate detection
- **Fee Structure Management** — academic year wise, with auto-calculated totals
- **Late Fine Calculation** — auto computed based on weeks past due date
- **Analytical Reports** with filters and PDF export:
  - Branch-wise fee report (by branch + year)
  - Duration-wise collection report
  - Student fee status report (paid/unpaid)
  - Hosteler / Day Scholar report
- **Server-side Pagination** for all reports
- **Hostel Fee Management** — separate tracking for hostelers and day scholars

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| View Engine | EJS + EJS-Mate |
| Database | MongoDB + Mongoose |
| Job Queue | Bull + Redis (Upstash) |
| Payment Gateway | Razorpay |
| Cloud Storage | Cloudinary |
| Email | Nodemailer + Gmail SMTP |
| PDF Generation | Puppeteer (reports), PDFKit (receipts) |
| Authentication | Express-Session + bcrypt |
| File Upload | Multer |
| CSV Processing | csv-parser |
| Frontend | Bootstrap 5 + Bootstrap Icons |

---

## Project Structure

```
fee-management/
├── config/    # DB, mail, cloud setup
│   ├── cloudinary.js
│   ├── database.js
│   ├── mailer.js
│   └── queue.js
│
├── controllers/
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── feeStructure.controller.js
│   ├── payment.controller.js
│   ├── report.controller.js
│   └── student.controller.js
│
├── middleware/
│   └── isAdmin.js
│
├── models/
│   ├── admin.model.js
│   ├── branch.model.js
│   ├── feeStructure.model.js
│   ├── payment.model.js
│   └── student.model.js
│
├── public/
│   ├── css/
│       └── style.css
│
├── routes/
│   ├── adminRoutes.js
│   ├── feeStructureRoutes.js
│   ├── paymentRoutes.js
│   ├── reportRoutes.js
│   └── studentRoutes.js
│
├── uploads/
│
├── utils/
│   ├── calculateExpectedTotal.js
│   ├── exportPDF.js
│   ├── ExpressError.js
│   ├── generateReceiptPDF.js
│   ├── getLateFine.js
│   ├── pdfGenerator.js
│   ├── sendOtpEmail.js
│   ├── sendReceiptEmail.js
│   ├── uploadToCloudinary.js
│   └── wrapAsync.js
│
├── views/
│   ├── admin/
│   │   ├── auth/
│   │   │   ├── forgetPassword.ejs
│   │   │   ├── login.ejs
│   │   │   ├── new-password.ejs
│   │   │   ├── register.ejs
│   │   │   ├── reset-verify-otp.ejs
│   │   │   └── verify-otp.ejs
│   │   │
│   │   ├── fee/
│   │   │   ├── edit.ejs
│   │   │   ├── index.ejs
│   │   │   └── new.ejs
│   │   │
│   │   ├── student/
│   │   │   ├── edit.ejs
│   │   │   ├── new.ejs
│   │   │   ├── search.ejs
│   │   │   └── show.ejs
│   │   │
│   │   ├── dashboard.ejs
│   │   └── payments.ejs
│   │
│   ├── layouts/
│   │   └── boilerplate.ejs
│   │
│   ├── partials/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   │
│   ├── report/
│   │   ├── pdf/
│   │   │   ├── branch-report.ejs
│   │   │   ├── duration-report.ejs
│   │   │   ├── hostel-report.ejs
│   │   │   └── student-status.ejs
│   │   │
│   │   ├── branch-report.ejs
│   │   ├── duration-report.ejs
│   │   ├── hostel-report.ejs
│   │   ├── index.ejs
│   │   └── student-status.ejs
│   │
│   ├── student/
│   │   ├── show_student_details.ejs
│   │   ├── student_search_form.ejs
|   |
│   ├── contact.ejs
│   ├── error.ejs
│   ├── home.ejs
│   ├── index.ejs
│   ├── pay.ejs
│   └── receipt.ejs
│
├── workers/
│   └── receiptWorker.js
└── app.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Redis (local or Upstash cloud)
- Razorpay account
- Cloudinary account
- Gmail account with App Password enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fee-management.git
cd fee-management

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URL=your_mongodb_connection_string

# Session
SECRET=your_session_secret

# Redis (Upstash)
REDIS_HOST=your_upstash_host
REDIS_PORT=6379
REDIS_PASSWORD=your_upstash_password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Running the Application

The application requires two processes running simultaneously — the main server and the background worker.

```bash
# Terminal 1 — Start the server
npm start

# Terminal 2 — Start the background worker
npm run worker
```

The application will be available at `http://localhost:5000`

---

## CSV Bulk Upload Format

For bulk student upload, prepare a CSV file with these columns:

```csv
name,rollNo,branch,year,isHosteller,contactNumber,email,address,feeStructure
Madhav Singh,CS001,cse,1,false,9999999999,madhav@example.com,Lucknow,2024-2025
Rohan Jain,CS002,cse,2,true,8888888888,rohan@example.com,Prayagraj,2024-2025
```

Valid branch codes: `cse`, `me`, `ee`, `civil`, `ece`, `ip`, `ic`

The `feeStructure` column must match an existing academic year (e.g. `2024-2025`).

---

## Architecture

### Payment Flow

```
Student pays
    ↓
Razorpay order created
    ↓
Payment saved to MongoDB
    ↓
User redirected to receipt page instantly
    ↓
Job added to Bull queue
    ↓
Worker picks up job independently
    ↓
PDF generated → uploaded to Cloudinary → emailed to student
    ↓
Payment record updated (automationStatus: success)
```

### Why Bull + Redis?

The background job queue replaces a naive `setImmediate` approach with a production-grade solution:

| Feature | setImmediate | Bull + Redis |
|---|---|---|
| Survives server restart | No | Yes |
| Auto retry on failure | No | Yes (3 attempts) |
| Concurrency control | No | Yes |
| Job visibility | No | Yes |
| Separate process | No | Yes |

---

## API Routes

### Admin Routes (`/api/v1/admin`)

| Method | Route | Description |
|---|---|---|
| GET | `/login` | Login page |
| POST | `/login` | Authenticate admin |
| GET | `/register` | Register page |
| POST | `/register` | Create admin account |
| GET | `/verify-otp` | OTP verification page |
| POST | `/verify-otp` | Verify OTP |
| GET | `/dashboard` | Admin dashboard |
| GET | `/students` | Student search page |
| GET | `/students/search` | Search student |
| GET | `/students/add` | Add student form |
| POST | `/students/add` | Add single student |
| POST | `/students/bulk` | Bulk CSV upload |
| GET | `/students/:id/edit` | Edit student form |
| POST | `/students/:id` | Update student |
| POST | `/students/toggle-hostel/:id` | Toggle hostel status |
| GET | `/payments` | All payments |
| GET | `/logout` | Logout |

### Payment Routes (`/api/v1/payments`)

| Method | Route | Description |
|---|---|---|
| GET | `/new` | Payment page |
| POST | `/` | Save payment |
| POST | `/create-order` | Create Razorpay order |
| GET | `/receipt/:paymentId` | View receipt |
| GET | `/receipt/:id/pdf` | Download receipt PDF |

### Report Routes (`/api/v1/reports`)

| Method | Route | Description |
|---|---|---|
| GET | `/` | Reports home |
| GET | `/branch` | Branch-wise report |
| GET | `/duration` | Duration-wise report |
| GET | `/student-status` | Student status report |
| GET | `/hostel` | Hosteler/Day Scholar report |

### Fee Structure Routes (`/api/v1/fees`)

| Method | Route | Description |
|---|---|---|
| GET | `/` | All fee structures |
| GET | `/new` | New fee structure form |
| POST | `/` | Create fee structure |
| GET | `/:id/edit` | Edit form |
| PUT | `/:id` | Update fee structure |

---

## Fee Calculation Logic

Expected total for each student is calculated as:

```
ExpectedTotal = FeeStructure.totalAmount
              - (isHosteller ? 0 : hostelFee)
              - (year !== 1 ? cautionMoney : 0)
```

Late fine is calculated as:

```
LateFine = ceil(daysOverdue / 7) × finePerWeek
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT

---

## Author

Madhav Singh Rana — [GitHub](https://github.com/madhav-rana) | [LinkedIn](https://linkedin.com/in/madhav-rana)
