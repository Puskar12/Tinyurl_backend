import express from "express";
import {
  createLink,
  listLinks,
  getLinkStats,
  deleteLink,
  updateLink,
} from "../controllers/linkController.js";

const router = express.Router();

router.post("/", createLink);
router.get("/", listLinks);
router.get("/:code", getLinkStats);
router.delete("/:code", deleteLink);
router.put("/:code", updateLink)

export default router;
