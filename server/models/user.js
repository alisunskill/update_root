const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  language: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  dp: {
    type: String,
    default:"/uploads/dps/Default_DP.png"
  },
  about: {
    type: String,
    default:"Fell in love with traveling and want to share my experiences with the world!",
  },
  emailVerified: {
    type: Boolean,
    default:false,
    required: true,
  },
  token: { type: String },
  resetToken: {
    type: String,
    default: null,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationTokenExpiration: {
    type: Date,
    default: null,
  },
});

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
