// PUT /api/notes/[id]
import connect from "@/lib/mongodb";
import { withAuth } from "@/middleware/auth";
import Note from "@/models/Note";

async function handler(req, res) {
  await connect();
  const user = req.user;
  const { id } = req.query;

  if (req.method === "PUT") {
    const { title, content } = req.body || {};
    const note = await Note.findOneAndUpdate(
      { _id: id, owner: user._id },
      { title, content },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });
    return res.status(200).json({ note });
  }

  if (req.method === "DELETE") {
    const note = await Note.findOneAndDelete({ _id: id, owner: user._id });
    if (!note) return res.status(404).json({ error: "Note not found" });
    return res.status(200).json({ success: true });
  }

  return res.status(405).end();
}

export default withAuth(handler);
