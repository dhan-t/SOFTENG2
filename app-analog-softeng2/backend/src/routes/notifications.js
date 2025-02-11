import express from "express";
const router = express.Router();

// Endpoint to get notifications
router.get("/", async (req, res) => {
  try {
    const collection = req.app.locals.db.collection("notifications");
    const notifications = await collection.find().toArray();
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

export default router;