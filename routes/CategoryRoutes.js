const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// ----------------------
// GET Categories
// ----------------------
router.get("/get-Allcategories", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const categories = await Category.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, categories });
    } catch (err) {
        console.log("Error fetching categories:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ----------------------
// CREATE Category
// ----------------------
router.post("/add-categories", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, color } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        const exists = await Category.findOne({ userId, name });
        if (exists) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        const category = new Category({ userId, name: name.trim(), color });
        await category.save();

        res.status(201).json({ success: true, message: "Category created", category });
    } catch (err) {
        console.log("Create category error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ----------------------
// UPDATE Category
// ----------------------
router.put("/update-categories/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { name, color } = req.body;

        if (name) {
            const duplicate = await Category.findOne({
                userId,
                name,
                _id: { $ne: id }
            });

            if (duplicate) {
                return res.status(400).json({
                    success: false,
                    message: "Another category with same name exists"
                });
            }
        }

        const updated = await Category.findOneAndUpdate(
            { _id: id, userId },
            { $set: { name, color } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.json({ success: true, message: "Category updated", category: updated });
    } catch (err) {
        console.log("Update category error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ----------------------
// DELETE Category
// ----------------------
router.delete("/delete-categories/:id", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const deleted = await Category.findOneAndDelete({ _id: id, userId });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.json({ success: true, message: "Category deleted" });
    } catch (err) {
        console.log("Delete category error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
