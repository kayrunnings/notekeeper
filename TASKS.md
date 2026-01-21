# Notekeeper Tasks

> **Auto-synced with Linear** — Last updated: 2026-01-21
>
> Linear Project: [Notekeeper](https://linear.app/kays-personal-playground/project/notekeeper-85802f05b21d)

---

## 🎯 Current Focus

### Next Task: KAY-12

**🎨 UI: Build folder sidebar component**

Build the sidebar component that displays folders and allows navigation between them.

**Component Structure:**
```
Sidebar
├── "All Notes" link
├── "Favorites" link (existing)
├── Divider
├── "Folders" section header
│   └── "+ New Folder" button
├── FolderList
│   └── FolderItem (for each folder)
│       ├── Folder icon
│       ├── Folder name
│       ├── Note count badge
│       └── Context menu (rename, delete)
└── "Unfiled" link
```

**Acceptance Criteria:**
- [ ] Sidebar displays "All Notes", "Favorites", folder list, "Unfiled"
- [ ] Can create a new folder via inline input
- [ ] Can delete a folder via context menu
- [ ] Clicking a folder calls `onFolderSelect` with correct ID
- [ ] Currently selected item is visually highlighted

**Files to create:**
- `components/Sidebar.tsx` — Main sidebar component
- Uses: shadcn/ui, lucide-react icons, folder server actions

**Linear:** https://linear.app/kays-personal-playground/issue/KAY-12

---

## 📋 Backlog

### User Story: KAY-9 — Folders/Notebooks

**As a** Notekeeper user
**I want to** organize my notes into folders (notebooks)
**So that** I can keep related notes together and find them more easily

| Task | Title | Status | Type |
|------|-------|--------|------|
| KAY-10 | 🗄️ DB: Create folders table and update notes schema | ✅ Done | Database |
| KAY-11 | 🔌 API: Create folder service functions | ✅ Done | Backend |
| **KAY-12** | **🎨 UI: Build folder sidebar component** | **⬜ Next** | Frontend |
| KAY-13 | 🎨 UI: Add folder rename functionality | ⬜ Backlog | Frontend |
| KAY-14 | 🔌 Integration: Connect sidebar to notes list filtering | ⬜ Backlog | Integration |
| KAY-15 | 🎨 UI: Add "Move to folder" functionality on notes | ⬜ Backlog | Frontend |
| KAY-16 | 🧪 Test: End-to-end testing of folders feature | ⬜ Backlog | Testing |

---

## 📝 Task Details

### KAY-13: Add folder rename functionality
- Double-click folder name → inline edit → Enter to save
- Or: context menu → "Rename" → modal dialog
- **Depends on:** KAY-12

### KAY-14: Connect sidebar to notes list filtering
- Clicking folder filters notes list
- "All Notes" shows everything
- "Unfiled" shows notes with no folder
- **Depends on:** KAY-12

### KAY-15: Add "Move to folder" on notes
- Dropdown on note card to select folder
- Can move to any folder or "Unfiled"
- **Depends on:** KAY-12, KAY-14

### KAY-16: End-to-end testing
- Test all folder CRUD operations
- Test navigation and filtering
- Test edge cases (empty folders, long names, etc.)
- **Depends on:** KAY-12, KAY-13, KAY-14, KAY-15

---

## ✅ Completed

| Task | Title | Completed |
|------|-------|-----------|
| KAY-10 | 🗄️ DB: Create folders table and update notes schema | 2026-01-21 |
| KAY-11 | 🔌 API: Create folder service functions | 2026-01-21 |

---

## 🔮 Future Ideas (Not Yet in Linear)

These are potential improvements identified but not yet added as tasks:

- **Dark Mode** — Toggle between light and dark themes
- **Rich Text Editor** — Bold, italic, headers, lists
- **Markdown Support** — Write in markdown with preview
- **Archive Notes** — Soft-delete instead of permanent delete
- **Export Notes** — Download as markdown or JSON
- **Keyboard Shortcuts** — Cmd+N for new note, etc.

---

## How to Use This File

**For Claude Code:**
1. Read this file to understand current priorities
2. Work on the "Next Task" section
3. Check "Task Details" for dependencies

**For the human:**
1. This file is synced with Linear by Claude (in chat)
2. After tasks are completed, ask Claude to update this file
3. Add new ideas to "Future Ideas" section

**Sync command (in Claude.ai chat):**
> "Please sync TASKS.md with Linear"
