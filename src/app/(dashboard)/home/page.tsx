"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { CreateNoteDialog } from "@/components/CreateNoteDialog";
import { EditNoteDialog } from "@/components/EditNoteDialog";
import { ViewNoteDialog } from "@/components/ViewNoteDialog";

interface Note {
  title: string;
  content: string;
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([
    { title: "First Note", content: "This is the first note content" },
    { title: "Meeting with team", content: "Discussion at 5pm about sprint" },
    { title: "Groceries", content: "Milk, bread, eggs, veggies" },
  ]);

  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(
    null
  );
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleDelete = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
    if (selectedNoteIndex === index) setSelectedNoteIndex(null);
  };

  const handleEditSave = (updatedNote: { title: string; content: string }) => {
    if (editIndex === null) return;
    const updated = [...notes];
    updated[editIndex] = updatedNote;
    setNotes(updated);
    setEditIndex(null);
    setSelectedNoteIndex(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px- 0">
          <div className="flex items-center gap-2">
            <img src="./icon.svg" />
            <span className="text-lg font-bold">Dashboard</span>
          </div>
          <nav>
            <a
              href="/logout"
              className="text-sm font-medium underline text-blue-600"
            >
              Sign out
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* User Info */}
          <Card className="p-4">
            <h2 className="text-2xl font-bold">Welcome, Jonas Kahnwald !</h2>
            <p>
              <span className="font-medium">Email:</span> abc@gmail.com
            </p>
          </Card>

          {/* Notes Section */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <CreateNoteDialog
                onCreate={(note) => setNotes((prev) => [...prev, note])}
              />
              <h2 className="text-xl font-semibold mt-4 md:mt-0">Notes</h2>
            </div>

            <div className="grid gap-3">
              {notes.map((note, index) => (
                <Card
                  key={index}
                  className="flex flex-row items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setSelectedNoteIndex(index)}
                >
                  <span
                    className="font-medium truncate"
                  >
                    {note.title}
                  </span>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditIndex(index);
                      }}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(index);
                      }}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Card>
              ))}
              {notes.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No notes created yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* View Dialog */}
      <ViewNoteDialog
        open={selectedNoteIndex !== null}
        onOpenChange={(open) => !open && setSelectedNoteIndex(null)}
        note={selectedNoteIndex !== null ? notes[selectedNoteIndex] : null}
        onEdit={() => {
          setEditIndex(selectedNoteIndex);
        }}
        onDelete={() => {
          if (selectedNoteIndex !== null) handleDelete(selectedNoteIndex);
        }}
      />

      {/* Edit Dialog */}
      <EditNoteDialog
        open={editIndex !== null}
        onOpenChange={(open) => !open && setEditIndex(null)}
        initialNote={
          editIndex !== null ? notes[editIndex] : null
        }
        onSave={handleEditSave}
      />

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
