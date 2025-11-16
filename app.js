const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const auth = require('./middleware/auth');


dotenv.config();
const app = express();
app.use(express.json());
// const corsOptions = {
//   origin: ['https://expense-tracker-b29b5.web.app',"http://localhost:3000"],
//   methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization'],
//   credentials: true
// };

app.use(cors());

// ----------------------
// MongoDB Connection
// ----------------------
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("DB Error:", err));


// ----------------------
// Protected Route
// ----------------------
app.get("/profile", auth, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
});


// //////////////////////////////CATEGORY ROUTES ////////////////////////////////

const categoryRoutes = require('./routes/CategoryRoutes');
app.use("/", categoryRoutes);

// ///////////////////User ROUTES ///////////////////////

const userRoutes = require('./routes/UserRoutes');
app.use("/", userRoutes);

// //////////////////////////////BUDGET ROUTES ////////////////////////////////
const budgetRoutes = require('./routes/budgetRoutes');
app.use("/", budgetRoutes);

// //////////////////////////////EXPENSE ROUTES ////////////////////////////////
const expenseRoutes = require("./routes/ExpenseRoutes");
app.use("/", expenseRoutes);



app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
