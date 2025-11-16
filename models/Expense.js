const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        categoryId: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: String, required: true },
        description: { type: String, default: "" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
