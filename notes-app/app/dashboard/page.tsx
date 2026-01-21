"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Note, NoteInput } from "@/lib/types"
import { NotesList } from "@/components/notes-list"
import { NoteEditor } from "@/components/note-editor"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, StickyNote, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Fetch notes and user on mount
  useEffect(() => {
    async function loadData() {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUserEmail(user.email ?? null)

      // Fetch notes
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error fetching notes:", error)
      } else {
        setNotes(data || [])
      }
      setIsLoading(false)
    }

    loadData()
  }, [router, supabase])

  // Handle creating or updating a note
  const handleSaveNote = async (noteInput: NoteInput, existingId?: string) => {
    if (existingId) {
      // Update existing note
      const { data, error } = await supabase
        .from("notes")
        .update({
          title: noteInput.title,
          content: noteInput.content,
          tags: noteInput.tags,
          is_favorite: noteInput.is_favorite,
        })
        .eq("id", existingId)
        .select()
        .single()

      if (error) {
        console.error("Error updating note:", error)
        return
      }

      setNotes((prev) =>
        prev.map((note) => (note.id === existingId ? data : note))
      )
    } else {
      // Create new note
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: user.id,
          title: noteInput.title,
          content: noteInput.content,
          tags: noteInput.tags,
          is_favorite: noteInput.is_favorite ?? false,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating note:", error)
        return
      }

      setNotes((prev) => [data, ...prev])
    }
  }

  // Handle deleting a note
  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return
    }

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId)

    if (error) {
      console.error("Error deleting note:", error)
      return
    }

    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  // Handle toggling favorite
  const handleToggleFavorite = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    const newFavoriteStatus = !note.is_favorite

    // Optimistic update
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, is_favorite: newFavoriteStatus } : n
      )
    )

    const { error } = await supabase
      .from("notes")
      .update({ is_favorite: newFavoriteStatus })
      .eq("id", noteId)

    if (error) {
      console.error("Error toggling favorite:", error)
      // Revert on error
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, is_favorite: !newFavoriteStatus } : n
        )
      )
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  // Open editor for new note
  const handleNewNote = () => {
    setEditingNote(null)
    setIsEditorOpen(true)
  }

  // Open editor for existing note
  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setIsEditorOpen(true)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <StickyNote className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">Notekeeper</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleNewNote} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Note</span>
            </Button>
            
            {/* User info and sign out */}
            <div className="flex items-center gap-2 pl-3 border-l">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium" title={userEmail ?? undefined}>
                {userEmail?.[0]?.toUpperCase() ?? "U"}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                title="Sign out"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <NotesList
          notes={notes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
          onToggleFavorite={handleToggleFavorite}
        />
      </main>

      {/* Note editor modal */}
      <NoteEditor
        note={editingNote}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false)
          setEditingNote(null)
        }}
        onSave={handleSaveNote}
      />
    </div>
  )
}
