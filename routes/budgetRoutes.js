const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const auth = require("../middleware/auth");

// ----------------------
// Add / Update Budget
// ----------------------
router.post("/add-budget", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { categoryId, month, limit } = req.body;

        if (!categoryId || !month || limit === undefined || limit === null) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Upsert: create or update the monthly budget
        const budget = await Budget.findOneAndUpdate(
            { userId, categoryId, month },
            { $set: { limit } },
            { new: true, upsert: true }
        );

        res.json({ success: true, message: "Budget saved", budget });

    } catch (err) {
        console.log("Add Budget Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ----------------------
// Get budgets for a month
// ----------------------
router.get("/get-budgets", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { month } = req.query;

        if (!month) {
            return res.status(400).json({ success: false, message: "Month is required" });
        }

        const budgets = await Budget.find({ userId, month }).populate("categoryId", "name color");

        res.json({ success: true, budgets });

    } catch (err) {
        console.log("Get Budgets Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ----------------------
// Update a specific budget
// ----------------------
router.put("/update-budget/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { limit } = req.body;

        const updated = await Budget.findOneAndUpdate(
            { _id: id, userId },
            { $set: { limit } },
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ success: false, message: "Budget not found" });

        res.json({ success: true, message: "Budget updated", budget: updated });

    } catch (err) {
        console.log("Update Budget Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ----------------------
// Delete a budget
// ----------------------
router.delete("/delete-budget/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const deleted = await Budget.findOneAndDelete({ _id: id, userId });

        if (!deleted)
            return res.status(404).json({ success: false, message: "Budget not found" });

        res.json({ success: true, message: "Budget deleted" });

    } catch (err) {
        console.log("Delete Budget Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
