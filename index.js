import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import linkRoutes from "./routes/linkRoutes.js";
import Link from "./models/Link.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("TinyUrl API Running"));

app.get("/health", (req, res) => {
  return res.status(200).json({ ok: true, version: "1.0" });
});

app.use("/api/links", linkRoutes);


app.get("/:code", async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });

    if (!link) return res.status(404).json({ error: "Not found" });
    
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    return res.redirect(302, link.targetUrl);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});


mongoose
  .connect(process.env.Mongo_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.listen(process.env.PORT,() => console.log(`Server Running on port : http://localhost:${process.env.PORT}`));
