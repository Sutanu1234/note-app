import connect from "@/lib/mongodb";
import { withAuth } from "@/middleware/auth";
import Note from "@/models/Note";
import jwt from "jsonwebtoken";

const NOTE_SECRET = process.env.NOTE_SECRET as string;

/* eslint-disable @typescript-eslint/no-explicit-any */
async function handler(req:any, res:any) {
  await connect();
  const user = req.user;

  if (req.method === "GET") {
    const notes = await Note.find({ owner: user._id })
      .sort({ updatedAt: -1 })
      .lean();

    // decode title/content before sending to client
    const decodedNotes = notes.map((n) => ({
      ...n,
      title: decodeJWT(n.title),
      content: decodeJWT(n.content),
    }));

    return res.status(200).json({ notes: decodedNotes });
  }

  if (req.method === "POST") {
    const { title, content } = req.body || {};
    if (!title || typeof title !== "string")
      return res.status(400).json({ error: "Title required" });

    // encode title/content
    const encodedTitle = encodeJWT(title);
    const encodedContent = encodeJWT(content || "");

    const note = await Note.create({
      owner: user._id,
      title: encodedTitle,
      content: encodedContent,
    });

    // return decoded note to client
    return res.status(201).json({
      note: {
        ...note.toObject(),
        title,
        content: content || "",
      },
    });
  }

  return res.status(405).end();
}

// helper to encode/decode
function encodeJWT(data: string) {
  if (!NOTE_SECRET) throw new Error("NOTE_SECRET is not defined");
  return jwt.sign({ data }, NOTE_SECRET);
}

function decodeJWT(token: string) {
  try {
    if (!NOTE_SECRET) throw new Error("NOTE_SECRET is not defined");
    return (jwt.verify(token, NOTE_SECRET) as { data: string }).data;
  } catch {
    return "[encrypted]";
  }
}

export default withAuth(handler);
