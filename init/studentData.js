const students = [
    {
        "name": "Aarav Sharma",
        "rollNo": "CS2023-001",
        "course": "courses[0]._id",
        "year": 1,
        "email": "aarav.sharma@example.com",
        "contactNumber": "9876500011",
        "address": "12 Elm Street, Lucknow"
    },
    {
        "name": "Priya Patel",
        "rollNo": "CS2023-002",
        "course": "courses[0]._id",
        "year": 1,
        "email": "priya.patel@example.com",
        "contactNumber": "9876500012",
        "address": "45 Oak Avenue, Mumbai"
    },
    {
        "name": "Rohan Kumar",
        "rollNo": "CS2023-003",
        "course": "courses[0]._id",
        "year": 1,
        "email": "rohan.kumar@example.com",
        "contactNumber": "9876500013",
        "address": "78 Maple Road, Delhi"
    },
    {
        "name": "Ananya Singh",
        "rollNo": "CS2023-004",
        "course": "courses[0]._id",
        "year": 1,
        "email": "ananya.singh@example.com",
        "contactNumber": "9876500014",
        "address": "23 Pine Lane, Kolkata"
    },
    {
        "name": "Vikram Joshi",
        "rollNo": "CS2023-005",
        "course": "courses[0]._id",
        "year": 1,
        "email": "vikram.joshi@example.com",
        "contactNumber": "9876500015",
        "address": "56 Cedar Street, Bangalore"
    },
    {
        "name": "Neha Gupta",
        "rollNo": "CS2023-006",
        "course": "courses[0]._id",
        "year": 1,
        "email": "neha.gupta@example.com",
        "contactNumber": "9876500016",
        "address": "89 Birch Avenue, Hyderabad"
    },
    {
        "name": "Arun Mehta",
        "rollNo": "CS2023-007",
        "course": "courses[0]._id",
        "year": 1,
        "email": "arun.mehta@example.com",
        "contactNumber": "9876500017",
        "address": "34 Walnut Road, Pune"
    },
    {
        "name": "Sneha Reddy",
        "rollNo": "CS2023-008",
        "course": "courses[0]._id",
        "year": 1,
        "email": "sneha.reddy@example.com",
        "contactNumber": "9876500018",
        "address": "67 Spruce Lane, Chennai"
    },
    {
        "name": "Kiran Malhotra",
        "rollNo": "CS2023-009",
        "course": "courses[0]._id",
        "year": 1,
        "email": "kiran.malhotra@example.com",
        "contactNumber": "9876500019",
        "address": "90 Ash Street, Ahmedabad"
    },
    {
        "name": "Rahul Verma",
        "rollNo": "CS2023-010",
        "course": "courses[0]._id",
        "year": 1,
        "email": "rahul.verma@example.com",
        "contactNumber": "9876500020",
        "address": "11 Poplar Avenue, Jaipur"
    },
    {
        "name": "Pooja Desai",
        "rollNo": "CS2023-011",
        "course": "courses[0]._id",
        "year": 1,
        "email": "pooja.desai@example.com",
        "contactNumber": "9876500021",
        "address": "22 Elm Street, Surat"
    },
    {
        "name": "Suresh Nair",
        "rollNo": "CS2023-012",
        "course": "courses[0]._id",
        "year": 1,
        "email": "suresh.nair@example.com",
        "contactNumber": "9876500022",
        "address": "33 Oak Road, Kochi"
    },
    {
        "name": "Divya Iyer",
        "rollNo": "CS2023-013",
        "course": "courses[0]._id",
        "year": 1,
        "email": "divya.iyer@example.com",
        "contactNumber": "9876500023",
        "address": "44 Maple Lane, Coimbatore"
    },
    {
        "name": "Amit Choudhary",
        "rollNo": "CS2023-014",
        "course": "courses[0]._id",
        "year": 1,
        "email": "amit.choudhary@example.com",
        "contactNumber": "9876500024",
        "address": "55 Pine Avenue, Nagpur"
    },
    {
        "name": "Meera Kapoor",
        "rollNo": "CS2023-015",
        "course": "courses[0]._id",
        "year": 1,
        "email": "meera.kapoor@example.com",
        "contactNumber": "9876500025",
        "address": "66 Cedar Road, Indore"
    },
    {
        "name": "Rajesh Khanna",
        "rollNo": "CS2023-016",
        "course": "courses[0]._id",
        "year": 1,
        "email": "rajesh.khanna@example.com",
        "contactNumber": "9876500026",
        "address": "77 Birch Lane, Bhopal"
    },
    {
        "name": "Sunita Rao",
        "rollNo": "CS2023-017",
        "course": "courses[0]._id",
        "year": 1,
        "email": "sunita.rao@example.com",
        "contactNumber": "9876500027",
        "address": "88 Walnut Street, Visakhapatnam"
    },
    {
        "name": "Manoj Tiwari",
        "rollNo": "CS2023-018",
        "course": "courses[0]._id",
        "year": 1,
        "email": "manoj.tiwari@example.com",
        "contactNumber": "9876500028",
        "address": "99 Spruce Avenue, Vadodara"
    },
    {
        "name": "Lakshmi Menon",
        "rollNo": "CS2023-019",
        "course": "courses[0]._id",
        "year": 1,
        "email": "lakshmi.menon@example.com",
        "contactNumber": "9876500029",
        "address": "10 Ash Lane, Thiruvananthapuram"
    },
    {
        "name": "Sanjay Srinivasan",
        "rollNo": "CS2023-020",
        "course": "courses[0]._id",
        "year": 1,
        "email": "sanjay.srinivasan@example.com",
        "contactNumber": "9876500030",
        "address": "21 Poplar Road, Mysore"
    },
    {
        "name": "Anjali Bhat",
        "rollNo": "CS2023-021",
        "course": "courses[0]._id",
        "year": 1,
        "email": "anjali.bhat@example.com",
        "contactNumber": "9876500031",
        "address": "32 Elm Avenue, Nashik"
    },
    {
        "name": "Harish Pillai",
        "rollNo": "CS2023-022",
        "course": "courses[0]._id",
        "year": 1,
        "email": "harish.pillai@example.com",
        "contactNumber": "9876500032",
        "address": "43 Oak Lane, Ludhiana"
    },
    {
        "name": "Kavita Das",
        "rollNo": "CS2023-023",
        "course": "courses[0]._id",
        "year": 1,
        "email": "kavita.das@example.com",
        "contactNumber": "9876500033",
        "address": "54 Maple Street, Agra"
    },
    {
        "name": "Naveen Rathi",
        "rollNo": "CS2023-024",
        "course": "courses[0]._id",
        "year": 1,
        "email": "naveen.rathi@example.com",
        "contactNumber": "9876500034",
        "address": "65 Pine Road, Varanasi"
    },
    {
        "name": "Swati Mishra",
        "rollNo": "CS2023-025",
        "course": "courses[0]._id",
        "year": 1,
        "email": "swati.mishra@example.com",
        "contactNumber": "9876500035",
        "address": "76 Cedar Lane, Patna"
    },
    {
        "name": "Alok Sengupta",
        "rollNo": "CS2023-026",
        "course": "courses[0]._id",
        "year": 1,
        "email": "alok.sengupta@example.com",
        "contactNumber": "9876500036",
        "address": "87 Birch Road, Bhubaneswar"
    },
    {
        "name": "Preeti Chavan",
        "rollNo": "CS2023-027",
        "course": "courses[0]._id",
        "year": 1,
        "email": "preeti.chavan@example.com",
        "contactNumber": "9876500037",
        "address": "98 Walnut Avenue, Guwahati"
    },
    {
        "name": "Vishal Dubey",
        "rollNo": "CS2023-028",
        "course": "courses[0]._id",
        "year": 1,
        "email": "vishal.dubey@example.com",
        "contactNumber": "9876500038",
        "address": "09 Spruce Street, Dehradun"
    },
    {
        "name": "Ritu Agarwal",
        "rollNo": "CS2023-029",
        "course": "courses[0]._id",
        "year": 1,
        "email": "ritu.agarwal@example.com",
        "contactNumber": "9876500039",
        "address": "18 Ash Road, Chandigarh"
    },
    {
        "name": "Gaurav Saxena",
        "rollNo": "CS2023-030",
        "course": "courses[0]._id",
        "year": 1,
        "email": "gaurav.saxena@example.com",
        "contactNumber": "9876500040",
        "address": "29 Poplar Lane, Ranchi"
    },
    {
        "name": "Shweta Bansal",
        "rollNo": "CS2023-031",
        "course": "courses[0]._id",
        "year": 1,
        "email": "shweta.bansal@example.com",
        "contactNumber": "9876500041",
        "address": "39 Elm Road, Jodhpur"
    },
    {
        "name": "Anil Purohit",
        "rollNo": "CS2023-032",
        "course": "courses[0]._id",
        "year": 1,
        "email": "anil.purohit@example.com",
        "contactNumber": "9876500042",
        "address": "49 Oak Street, Raipur"
    },
    {
        "name": "Mona Kulkarni",
        "rollNo": "CS2023-033",
        "course": "courses[0]._id",
        "year": 1,
        "email": "mona.kulkarni@example.com",
        "contactNumber": "9876500043",
        "address": "59 Maple Avenue, Rajkot"
    },
    {
        "name": "Deepak Rana",
        "rollNo": "CS2023-034",
        "course": "courses[0]._id",
        "year": 1,
        "email": "deepak.rana@example.com",
        "contactNumber": "9876500044",
        "address": "69 Pine Lane, Amritsar"
    },
    {
        "name": "Sarika Thakur",
        "rollNo": "CS2023-035",
        "course": "courses[0]._id",
        "year": 1,
        "email": "sarika.thakur@example.com",
        "contactNumber": "9876500045",
        "address": "79 Cedar Street, Allahabad"
    },
    {
        "name": "Ravi Shukla",
        "rollNo": "CS2023-036",
        "course": "courses[0]._id",
        "year": 1,
        "email": "ravi.shukla@example.com",
        "contactNumber": "9876500046",
        "address": "89 Birch Avenue, Jabalpur"
    },
    {
        "name": "Nisha Yadav",
        "rollNo": "CS2023-037",
        "course": "courses[0]._id",
        "year": 1,
        "email": "nisha.yadav@example.com",
        "contactNumber": "9876500047",
        "address": "99 Walnut Road, Gwalior"
    },
    {
        "name": "Pankaj Trivedi",
        "rollNo": "CS2023-038",
        "course": "courses[0]._id",
        "year": 1,
        "email": "pankaj.trivedi@example.com",
        "contactNumber": "9876500048",
        "address": "19 Spruce Lane, Udaipur"
    },
    {
        "name": "Simran Kaur",
        "rollNo": "CS2023-039",
        "course": "courses[0]._id",
        "year": 1,
        "email": "simran.kaur@example.com",
        "contactNumber": "9876500049",
        "address": "29 Ash Street, Kota"
    },
    {
        "name": "Akhil Pandey",
        "rollNo": "CS2023-040",
        "course": "courses[0]._id",
        "year": 1,
        "email": "akhil.pandey@example.com",
        "contactNumber": "9876500050",
        "address": "39 Poplar Avenue, Jalandhar"
    },
    {
        "name": "Tanvi Shah",
        "rollNo": "CS2023-041",
        "course": "courses[0]._id",
        "year": 1,
        "email": "tanvi.shah@example.com",
        "contactNumber": "9876500051",
        "address": "49 Elm Lane, Madurai"
    },
    {
        "name": "Rohit Mehra",
        "rollNo": "CS2023-042",
        "course": "courses[0]._id",
        "year": 1,
        "email": "rohit.mehra@example.com",
        "contactNumber": "9876500052",
        "address": "59 Oak Avenue, Hubli"
    },
    {
        "name": "Ishaani Banerjee",
        "rollNo": "CS2023-043",
        "course": "courses[0]._id",
        "year": 1,
        "email": "ishaani.banerjee@example.com",
        "contactNumber": "9876500053",
        "address": "69 Maple Road, Mangalore"
    },
    {
        "name": "Yashwant Reddy",
        "rollNo": "CS2023-044",
        "course": "courses[0]._id",
        "year": 1,
        "email": "yashwant.reddy@example.com",
        "contactNumber": "9876500054",
        "address": "79 Pine Street, Tiruchirappalli"
    },
    {
        "name": "Aditi Deshpande",
        "rollNo": "CS2023-045",
        "course": "courses[0]._id",
        "year": 1,
        "email": "aditi.deshpande@example.com",
        "contactNumber": "9876500055",
        "address": "89 Cedar Avenue, Salem"
    },
    {
        "name": "Kunal Oberoi",
        "rollNo": "CS2023-046",
        "course": "courses[0]._id",
        "year": 1,
        "email": "kunal.oberoi@example.com",
        "contactNumber": "9876500056",
        "address": "99 Birch Lane, Warangal"
    },
    {
        "name": "Bhavana Nair",
        "rollNo": "CS2023-047",
        "course": "courses[0]._id",
        "year": 1,
        "email": "bhavana.nair@example.com",
        "contactNumber": "9876500057",
        "address": "09 Walnut Street, Guntur"
    },
    {
        "name": "Harshad Zaveri",
        "rollNo": "CS2023-048",
        "course": "courses[0]._id",
        "year": 1,
        "email": "harshad.zaveri@example.com",
        "contactNumber": "9876500058",
        "address": "19 Spruce Road, Kollam"
    },
    {
        "name": "Charul Goel",
        "rollNo": "CS2023-049",
        "course": "courses[0]._id",
        "year": 1,
        "email": "charul.goel@example.com",
        "contactNumber": "9876500059",
        "address": "29 Ash Avenue, Aligarh"
    },
    {
        "name": "Dinesh Rastogi",
        "rollNo": "CS2023-050",
        "course": "courses[0]._id",
        "year": 1,
        "email": "dinesh.rastogi@example.com",
        "contactNumber": "9876500060",
        "address": "39 Poplar Lane, Bareilly"
    }
];

module.exports = students;