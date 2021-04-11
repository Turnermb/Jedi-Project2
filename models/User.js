// Import Schema and Model
const { Schema, model } = require("../db/connection");
// Stock Schema
const Stock = new Schema({
  name: { type: String, required: true },
  ticker: { type: String, required: true },
  price: { type: String, required: true },
  stockQty: { type: Number, required: true },
});
// User Schema
const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    stocks: [Stock],
  },
  { timestamps: true }
);

const User = model("user", UserSchema);

// Export User Model
module.exports = User;
