const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },
  color: { type: String, default: "#6c757d" },
  createdAt: { type: Date, default: Date.now },
});

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", CategorySchema);
