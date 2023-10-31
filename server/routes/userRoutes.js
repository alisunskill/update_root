const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middleware/dps");
const User = require("../models/user");

// Create a new user
router.post("/", userController.createUser);

// Login user
router.post("/login", userController.loginUser);
router.get("/verifyEmail", userController.verifyEmail);

// Forgot password - Generate reset token
router.post("/forgot-password", userController.forgotPassword);

// Reset password
router.post("/resetpassword", userController.resetPassword);

// verify new user email
router.get("/login/:token", userController.verifyEmail);

// getbyid username
router.get("/username/:userID", userController.getUsernameByID);

// update profile
router.put("/profile/:userID", userController.updateProfile);

// Delete user profile
router.delete("/profile/:userID", userController.deleteProfile);

//User Info
router.post("/userInfo", userController.userInfo);


router.post('/uploadDp', upload.single('dp'), async (req, res) => {
    try {
      // Log the contents of req.body and req.file for debugging
      console.log('req.body:', req.body);
      console.log('req.file:', req.file);
  
      // Get the user ID from the request parameters
      const { userId } = req.body;
      console.log('userId:', userId);
  
      // Update the user's dp field with the file path (you may need to adjust this based on your actual schema)
      const user = await User.findByIdAndUpdate(userId, { dp: `/${req.file.path}` }, { new: true });
  
      // Log the user object for debugging
      console.log('user:', user);
  
      if (!user) {
        return res.status(200).json({ status: false, message: 'User not found' });
      }
  
      return res.status(200).json({ status: true, message: 'DP uploaded successfully', user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while uploading the DP' });
    }
  });



module.exports = router;
