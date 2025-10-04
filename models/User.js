// /models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Хук pre('save') для хеширования пароля
UserSchema.pre("save", async function (next) {
  // Выполняем хеширование, только если пароль был изменен
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User; // ✅ CommonJS export