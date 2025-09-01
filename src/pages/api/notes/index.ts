// GET: list user's notes
// POST: create note { title, content }
import connect from "@/lib/mongodb";
import { withAuth } from "@/middleware/auth";
import Note from "@/models/Note";

async function handler(req, res) {
  await connect();
  const user = req.user;
  if (req.method === "GET") {
    const notes = await Note.find({ owner: user._id })
      .sort({ updatedAt: -1 })
      .lean();
    return res.status(200).json({ notes });
  }
  if (req.method === "POST") {
    const { title, content } = req.body || {};
    if (!title || typeof title !== "string")
      return res.status(400).json({ error: "Title required" });
    const note = await Note.create({
      owner: user._id,
      title,
      content: content || "",
    });
    return res.status(201).json({ note });
  }
  return res.status(405).end();
}

export default withAuth(handler);
