import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// REQUIRED for browser preflight
app.options("*", (_req, res) => {
  res.sendStatus(200);
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/lead", (req, res) => {
  console.log("📥 Lead received:", req.body);
  res.json({ success: true });
});

const PORT = Number(process.env.PORT) || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on ${PORT}`);
});
