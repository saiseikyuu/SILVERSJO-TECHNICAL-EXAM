import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, email, message, listing_id } = req.body;

  if (!name || !email || !message || !listing_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { error } = await supabaseAdmin.from("inquiries").insert([
    {
      name,
      email,
      message,
      listing_id,
    },
  ]);

  if (error) {
    console.error("Insert error:", error.message);
    return res.status(500).json({ error: "Failed to submit inquiry" });
  }

  res.status(201).json({ success: true });
});

export default router;
