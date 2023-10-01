require("dotenv").config();

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios");

const jwtKey = process.env.JWT_SECRET;
// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, region, email, username, language, password } =
      req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or username already exists" });
    }

    console.log(req.body);
    const salt = await bcrypt.genSalt(10);

    // const verificationToken = crypto.randomBytes(20).toString("hex");
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      firstName,
      lastName,
      region,
      email,
      username,
      language,
      password: hashedPassword,
    });

    await user.save();

    // verification new user
    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpiration = Date.now() + 3600000; // 1 hour expiration, adjust as needed

    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "jaiden.rowe@ethereal.email",
        pass: "7xyBzUvjMZTSNSxpQ4",
      },
    });

    const verificationURL = `http://localhost:3000/login?token=${verificationToken}`;

    const mailOptions = {
      from: "harmony.carroll@ethereal.email",
      to: user.email,
      subject: "Email Verification",
      text: `Click the following link to verify your email address: ${verificationURL}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        res.status(201).json({
          message:
            "User created successfully. Check your email for verification instructions.",
        });
      }
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// verify new user email

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOneAndUpdate(
      {
        verificationToken: token,
        verificationTokenExpiration: { $gt: Date.now() },
      },
      {
        emailVerified: true,
        $unset: {
          verificationToken: 1,
          verificationTokenExpiration: 1,
        },
      }
    );

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    // Redirect to a login page or send a success response
    res.redirect("/login"); // Or res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password, recaptchaResponse } = req.body;
    console.log(recaptchaResponse, "recaptchaResponse");
    const recaptchaSecretKey = "6LdNryEnAAAAAHvI4ty3RvMc2dnX0fR9aF1dXq7r";
    const recaptchaVerificationURL = `https://www.google.com/recaptcha/api/siteverify`;
    const verificationResponse = await axios.post(
      recaptchaVerificationURL,
      null,
      {
        params: {
          secret: recaptchaSecretKey,
          response: recaptchaResponse,
        },
      }
    );
    verificationResponse.data.success = true;

    if (!verificationResponse.data.success) {
      return res.status(401).json({ message: "reCAPTCHA verification failed" });
    }

    // console.log(email, password, "jjj");

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials2" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, jwtKey, {
      expiresIn: "1h",
    });
    user.token = token;
    res.status(200).json({
      message: "Login successful",
      token: token,
      userID: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 300000;
    // 5 minutes expired token

    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "jaiden.rowe@ethereal.email",
        pass: "7xyBzUvjMZTSNSxpQ4",
      },
    });

    const mailOptions = {
      from: "harmony.carroll@ethereal.email",
      to: user.email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: http://localhost:3000/resetpassword?token=${resetToken}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({
          message: "Reset token generated successfully and email sent",
          resetToken,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.password = hashPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "kellie.spinka62@ethereal.email",
        pass: "uTGFjjuhTsKVn4UMHX",
      },
    });

    const mailOptions = {
      from: "harmony.carroll@ethereal.email",
      to: user.email,
      subject: "Password Reset Confirmation",
      text: "Your password has been reset successfully.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUsernameByID = async (req, res) => {
  try {
    // const { userID } = req.params;
    let { userID } = req.params;
    userID = userID.trim();
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, region, email, language } = user;
    return res.status(200).json({ username, region, email, language });
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    // const { userID } = req.params;
    let { userID } = req.params;
    userID = userID.trim();
    const { username, region, email, language, password } = req.body;

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User's Profile is not found" });
    }

    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    if (username) {
      user.username = username;
    }

    if (region) {
      user.region = region;
    }

    if (email) {
      user.email = email;
    }

    if (language) {
      user.language = language;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delet the user profile
exports.deleteProfile = async (req, res) => {
  try {
    const { userID } = req.params;

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userID);

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
