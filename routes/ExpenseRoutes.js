const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Expense = require("../models/Expense");

// ADD EXPENSE
router.post("/add-expense", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { categoryId, amount, date, description } = req.body;

        if (!categoryId || !amount || !date) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const expense = new Expense({
            userId,
            categoryId,
            amount,
            date,
            description: description || ""
        });

        await expense.save();

        res.json({ success: true, message: "Expense added", expense });

    } catch (err) {
        console.log("Add Expense Error", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET EXPENSES (MONTHLY)
router.get("/get-expenses", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { month } = req.query;

        const expenses = await Expense.find({
            userId,
            date: { $regex: month }   // "2025-11"
        }).sort({ date: -1 });

        res.json({ success: true, expenses });

    } catch (err) {
        console.log("Get Expense Error", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// DELETE EXPENSE
router.delete("/delete-expense/:id", auth, async (req, res) => {
    try {
        const deleted = await Expense.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }

        res.json({ success: true, message: "Expense deleted" });

    } catch (err) {
        console.log("Delete Expense Error", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
