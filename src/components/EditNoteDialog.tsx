"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  title: string;
  content: string;
}

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialNote: Note | null;
  onSave: (updatedNote: { title: string; content: string }) => void;
}

export function EditNoteDialog({
  open,
  onOpenChange,
  initialNote,
  onSave,
}: EditNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
  if (initialNote) {
    setTitle(initialNote.title || "");
    setContent(initialNote.content || "");
  }
}, [initialNote]);


  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
