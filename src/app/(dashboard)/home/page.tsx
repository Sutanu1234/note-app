"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Cross, Pencil, Trash2 } from "lucide-react";

export default function DashboardPage() {
  const [notes, setNotes] = useState<string[]>([
    "First Note",
    "Meeting with team at 5pm",
    "Buy groceries",
  ]);

  const handleDelete = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
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
          <Card className="flex flex-col justify-between">
            <CardHeader className="w-full">
              <CardTitle className="text-2xl font-bold">
                Welcome, Jonas Kahnwald !
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="font-medium">Email:</span> abc@gmail.com
              </p>
            </CardContent>
          </Card>

          {/* <Separator className=""/> */}

          {/* Notes Section */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-64">
                Create Note
              </Button>
              <h2 className="text-xl font-semibold mt-4 md:mt-0">Notes</h2>
            </div>

            <div className="grid gap-3">
              {notes.map((note, index) => (
                <Card
                  key={index}
                  className="flex flex-row items-center justify-between p-4"
                >
                  {/* Text: truncate only on small screens */}
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {note}
                  </span>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => console.log("Edit", index)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
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

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
