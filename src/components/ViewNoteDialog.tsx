"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

interface ViewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: { title: string; content: string } | null;
  onEdit: () => void;
  onDelete: () => void;
}

export function ViewNoteDialog({
  open,
  onOpenChange,
  note,
  onEdit,
  onDelete,
}: ViewNoteDialogProps) {
  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {note.title}
          </DialogTitle>
        </DialogHeader>
        <div className="text-gray-700 whitespace-pre-line">{note.content}</div>

        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onEdit}
            className="flex items-center gap-1"
          >
            <Pencil size={16} />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="flex items-center gap-1"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
