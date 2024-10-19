const express = require("express");
const {
  getChatSuggestionController,
  getChatAnalysisController,
} = require("../controllers/aiControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/get/chat/suggestion").post(protect, getChatSuggestionController);
router.route("/get/chat/analyze").post(protect, getChatAnalysisController);

module.exports = router;
