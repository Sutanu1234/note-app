// PUT: update note { title, content }
// DELETE: delete note
import connect from "@/lib/mongodb";
import { withAuth } from "@/middleware/auth";
import Note from "@/models/Note";

async function handler(req, res) {
  const { id } = req.query;
  await connect();
  const user = req.user;
  if (req.method === "PUT") {
    const { title, content } = req.body || {};
    if (!title) return res.status(400).json({ error: "Title required" });
    const note = await Note.findOne({ _id: id, owner: user._id });
    if (!note) return res.status(404).json({ error: "Note not found" });
    note.title = title;
    note.content = content || "";
    await note.save();
    return res.status(200).json({ note });
  }
  if (req.method === "DELETE") {
    const note = await Note.findOneAndDelete({ _id: id, owner: user._id });
    if (!note) return res.status(404).json({ error: "Note not found" });
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
}

export default withAuth(handler);
