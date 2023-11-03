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

    // const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    const existingEmailUser = await User.findOne({ email });
    const existingUsernameUser = await User.findOne({ username });
    // if (existingUser) {
    //   return res
    //     .status(409)
    //     .json({ message: "Email or username already exists" });
    // }

    if (existingEmailUser) {
      return res.status(201).json({status:false, message: "Email already exists" });
    }

    if (existingUsernameUser) {
      return res.status(201).json({status:false, message: "Username already exists" });
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
      service: "gmail", // SMTP server hostname for Gmail
      auth: {
        user: "asim.sunskilltechs@gmail.com",
        pass: "zesl wjcb ksxw awlg",
      },
    });

    const verificationURL = `${process.env.FRONTEND_URL}verifyEmail?token=${verificationToken}`;

    const mailOptions = {
      from: "OnRoot <noreply@yourcompany.com>",
      to: email,
      subject: "Account Verification - OnRoot",
      html: `
        <p>Dear User,</p>
        <p>Thank you for choosing OnRoot for your account needs. To ensure the security of your account, please click the following link to verify your email address:</p>
        <p><a href="${verificationURL}">Verify Your Email</a></p>
        <p>If you did not sign up for an account with OnRoot, please disregard this email.</p>
        <p>Best Regards,<br>OnRoot</p>
      `,
    };
    

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json({status:true, message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// verify new user email

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log("token", token);

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
        .json({ status: "failed", message: "Invalid or expired verification token" });
    }

    // Verification successful
    res.status(200).json({ status: "verified", message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Internal server error" });
  }
};


// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password, recaptchaResponse } = req.body;
    //console.log(recaptchaResponse, "recaptchaResponse");
    const recaptchaSecretKey = process.env.RECAPETCHA_SECRET_KEY;
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

    console.log(email, password, "jjj");

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(200).json({status:false, message: "User not exists against the email" });
    }

    if (!user.emailVerified) {
      return res.status(200).json({status:false, message: "Email is not verified." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(200).json({status:false, message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, jwtKey, {
      expiresIn: "24h",
    });
    user.token = token;
    res.status(200).json({
      status:true,
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
      service: "gmail", // SMTP server hostname for Gmail
      auth: {
        user: "asim.sunskilltechs@gmail.com",
        pass: "zesl wjcb ksxw awlg",
      },
    });

    const mailOptions = {
      from: "OnRoot Support <support@onroot.com>",
      to: user.email,
      subject: "Password Reset Request",
      text: `Dear ${user.firstName},\n\nYou have requested to reset your password on OnRoot. To reset your password, please click the following link:\n\n${process.env.FRONTEND_URL}resetpassword?token=${resetToken}\n\nIf you did not make this request, please disregard this email. Your account's security is important to us.\n\nBest regards,\nOnRoot Support Team`,
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
      //resetTokenExpiration: { $gt: Date.now() },
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
      service: "gmail",
      // port: 587,
      auth: {
        user: "testsunskill@gmail.com",
        pass: "Testali7@",
      },
    });

    const mailOptions = {
      from: "testsunskill@gmail.com",
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
    const { username, region, email, language, password,about } = req.body;

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
    if (about) {
      user.about = about;
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
exports.userInfo = async (req, res) => {
  try {
    const { userID } = req.body;

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({status:false, message: "User not found" });
    }

    

    res.status(200).json({status:true, message: "successfully",data:user });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};