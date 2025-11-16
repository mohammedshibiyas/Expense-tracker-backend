const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    month: { type: String, required: true }, // format: "2025-02"
    limit: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

// One budget per category per month per user
BudgetSchema.index({ userId: 1, categoryId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Budget", BudgetSchema);
