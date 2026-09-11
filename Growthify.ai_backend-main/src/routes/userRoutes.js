import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  verifyPassword,
  updateName,
  changePassword,
  getSocialLinks,
  updateSocialLinks,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});
// Naye routes add kar diye!
router.post("/verify-password", authMiddleware, verifyPassword);
router.put("/update-name", authMiddleware, updateName);
router.put("/change-password", authMiddleware, changePassword);
router.get("/social-links", authMiddleware, getSocialLinks);
router.put("/social-links", authMiddleware, updateSocialLinks);

export default router;
