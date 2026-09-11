import bcrypt from "bcryptjs";
import User from "../models/user.js";

// 1. VERIFY PASSWORD (Before updating name)
export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // IMPORTANT: authMiddleware removes the password field, 
    // so we MUST re-fetch the user from the database to get the password hash.
    const userWithPassword = await User.findById(req.user._id);
    
    if (!userWithPassword) {
      return res.status(404).json({ message: "User not found" });
    }

    // Google Sign-in users might not have a password
    if (!userWithPassword.password) {
      return res.status(400).json({ message: "This account uses Google Sign-In. Password verification is not required/applicable." });
    }

    // Compare input password with database hash
    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Password verified successfully" });
  } catch (error) {
    console.error("Verify Password Error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
};

// 2. UPDATE NAME
export const updateName = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    // Update the name using req.user._id provided by authMiddleware
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { name: name.trim() }, 
      { returnDocument: "after" } // Returns the updated document
    ).select("-password"); // Explicitly exclude password in response

    res.status(200).json({ 
      message: "Name updated successfully", 
      user: { 
        name: updatedUser.name, 
        email: updatedUser.email 
      } 
    });
  } catch (error) {
    console.error("Update Name Error:", error);
    res.status(500).json({ message: "Server error while updating name" });
  }
};

// 3. CHANGE PASSWORD (Privacy & Security Tab)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Re-fetch user to get the current password hash
    const userWithPassword = await User.findById(req.user._id);
    
    if (!userWithPassword) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle Google users trying to change password
    if (!userWithPassword.password) {
      return res.status(400).json({ message: "This account was created with Google. You cannot change the password here." });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash the new password and update
    const salt = await bcrypt.genSalt(10);
    userWithPassword.password = await bcrypt.hash(newPassword, salt);
    await userWithPassword.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error while changing password" });
  }
};

export const getSocialLinks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("socialLinks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      youtube: user.socialLinks?.youtube || "",
      instagram: user.socialLinks?.instagram || "",
      snapchat: user.socialLinks?.snapchat || "",
      reddit: user.socialLinks?.reddit || "",
    });
  } catch (error) {
    console.error("Get Social Links Error:", error);
    res.status(500).json({ message: "Server error while loading social links" });
  }
};

export const updateSocialLinks = async (req, res) => {
  try {
    const { youtube = "", instagram = "", snapchat = "", reddit = "" } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        socialLinks: {
          youtube: String(youtube).trim(),
          instagram: String(instagram).trim(),
          snapchat: String(snapchat).trim(),
          reddit: String(reddit).trim(),
        },
      },
      { returnDocument: "after" },
    ).select("socialLinks");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Social links updated successfully",
      socialLinks: {
        youtube: updatedUser.socialLinks?.youtube || "",
        instagram: updatedUser.socialLinks?.instagram || "",
        snapchat: updatedUser.socialLinks?.snapchat || "",
        reddit: updatedUser.socialLinks?.reddit || "",
      },
    });
  } catch (error) {
    console.error("Update Social Links Error:", error);
    res.status(500).json({ message: "Server error while updating social links" });
  }
};
