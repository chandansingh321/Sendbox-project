# Rapid Review — Next.js Full-Stack Application

A modern full-stack web application for reviewing data assertions, comparisons, and queues. Built with **Next.js 16 (App Router)**, **React 19**, **Supabase (PostgreSQL)**, completely typed in **TypeScript** and styled with **Tailwind CSS**.

---

## 🌟 Key Features

- **Built with Next.js App Router**: Unified frontend and backend API Route Handlers in a single modern framework.
- **Dual-Role Workspace**:
  - **Reviewer**: Google Tasky-inspired assignments interface, claim tasks from assigned queues, side-by-side comparison of current vs. proposed values (35% Current, 35% Proposed, Dotted Separator, 30% Decision), record **Accept** or **No Action** decisions with standardized reasons and findings notes, draft auto-saving, and task completion.
  - **Admin**: Upload spreadsheets (`.csv`, `.xlsx`, `.xls`) to dynamically generate multi-field tasks and queues, download templates, filter tasks by status (*Ready*, *In Progress*, *Completed*), and inspect reviewer decisions in read-only mode.
- **Supabase PostgreSQL Integration**: Real-time cloud persistence for `queues` and `tasks` with Row Level Security (RLS) policies.
- **Graceful Local Fallback**: Seamlessly works with in-memory sample data if Supabase credentials or database tables are not yet configured.
- **Modular Component Design**: Every table, dialog, row, and form control is broken into isolated, reusable React components.

---

## 🏗️ Project Architecture

```text
Sendbox/
├── src/
│   ├── app/                                 # Next.js App Router
│   │   ├── layout.tsx                       # Root layout & page metadata
│   │   ├── page.tsx                         # Main page view
│   │   ├── globals.css                      # Tailwind imports & custom styles
│   │   └── api/                             # Serverless Route Handlers
│   │       ├── health/route.ts              # GET /api/health
│   │       ├── queues/route.ts              # GET /api/queues
│   │       ├── tasks/route.ts               # GET /api/tasks
│   │       └── tasks/[id]/route.ts          # PUT /api/tasks/:id
│   ├── types/
│   │   └── review.ts                        # TypeScript types (Queue, Task, TaskField, Decision, etc.)
│   ├── data/
│   │   └── initialData.ts                   # Default queues & tasks for local mode fallback
│   ├── context/
│   │   └── ReviewContext.tsx                # Global state & Supabase data synchronization
│   ├── lib/
│   │   └── supabase.ts                      # Supabase client initialization
│   └── components/
│       ├── views/                           # Individual application screens
│       │   ├── LoginView.tsx                # Role selection (Reviewer vs Admin) & sign-in
│       │   ├── AssignmentsView.tsx          # Reviewer assignments page wrapper
│       │   ├── AssignedTasksTable.tsx       # "Assigned tasks" table (claim tasks)
│       │   ├── AssignedQueuesTable.tsx      # "Assigned queues" table (start tasks)
│       │   ├── TaskReviewView.tsx           # Reviewer comparison & decision view
│       │   ├── TaskFieldRow.tsx             # Single row comparing Current vs. Proposed values
│       │   ├── DecisionControls.tsx         # Accept / No Action radios, reason list & notes
│       │   ├── AdminDashboardView.tsx       # Admin dashboard wrapper
│       │   ├── AdminUploadSection.tsx       # Spreadsheet upload (.csv/.xlsx) & sample loader
│       │   ├── AdminStatsFilter.tsx         # Ready / In Progress / Completed counter cards
│       │   ├── AdminTasksTable.tsx          # Filtered admin task list table
│       │   └── AdminTaskDetailView.tsx      # Admin read-only task inspector
│       ├── shells/                          # Layout wrappers & navigation headers
│       │   ├── TaskyShell.tsx               # Reviewer topbar & navigation tabs
│       │   ├── RapidReviewShell.tsx         # Task review topbar with title & status pill
│       │   └── AdminShell.tsx               # Admin workspace navigation header
│       ├── modals/                          # Popups & dialogs
│       │   ├── ModalRoot.tsx                # Modal coordinator
│       │   ├── DbGuideModal.tsx             # Supabase SQL setup instructions modal
│       │   └── TaskDoneModal.tsx            # Task completion & "Start next" modal
│       ├── common/                          # Shared reusable UI elements
│       │   ├── DbBadge.tsx                  # Supabase live connection indicator
│       │   ├── DbAlertBanner.tsx            # Schema notice banner
│       │   ├── AvatarMenu.tsx               # User avatar & sign-out dropdown menu
│       │   └── Toast.tsx                    # Floating notification toast
│       └── RapidReviewApp.tsx               # App view coordinator
├── supabase/
│   └── schema.sql                           # Full PostgreSQL migration (tables, RLS, seed data)
├── .env.local                               # Next.js environment configuration
├── tsconfig.json                            # TypeScript configuration
├── next.config.ts                           # Next.js configuration
├── package.json                             # Next.js package dependencies & scripts
└── README.md
```

---

## 🎯 Component Customization Quick Reference

| What you want to change | Component File |
| :--- | :--- |
| **Login screen, roles, and sign-in behavior** | [`src/components/views/LoginView.tsx`](./src/components/views/LoginView.tsx) |
| **Reviewer "Assigned Tasks" table & columns** | [`src/components/views/AssignedTasksTable.tsx`](./src/components/views/AssignedTasksTable.tsx) |
| **Reviewer "Assigned Queues" table & start button** | [`src/components/views/AssignedQueuesTable.tsx`](./src/components/views/AssignedQueuesTable.tsx) |
| **Field comparison row (Current vs. Proposed)** | [`src/components/views/TaskFieldRow.tsx`](./src/components/views/TaskFieldRow.tsx) |
| **Accept / No Action radios, reason list & notes** | [`src/components/views/DecisionControls.tsx`](./src/components/views/DecisionControls.tsx) |
| **Task review page layout & footer action buttons** | [`src/components/views/TaskReviewView.tsx`](./src/components/views/TaskReviewView.tsx) |
| **Spreadsheet upload (.csv/.xlsx) & template generator** | [`src/components/views/AdminUploadSection.tsx`](./src/components/views/AdminUploadSection.tsx) |
| **Admin task filter cards (Ready, In Progress, Done)** | [`src/components/views/AdminStatsFilter.tsx`](./src/components/views/AdminStatsFilter.tsx) |
| **Admin task list & read-only inspection** | [`src/components/views/AdminTasksTable.tsx`](./src/components/views/AdminTasksTable.tsx) & [`AdminTaskDetailView.tsx`](./src/components/views/AdminTaskDetailView.tsx) |
| **Topbars & navigation headers** | [`TaskyShell.tsx`](./src/components/shells/TaskyShell.tsx), [`RapidReviewShell.tsx`](./src/components/shells/RapidReviewShell.tsx), [`AdminShell.tsx`](./src/components/shells/AdminShell.tsx) |
| **Global state, claiming tasks & Supabase queries** | [`src/context/ReviewContext.tsx`](./src/context/ReviewContext.tsx) |

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Configure Supabase Credentials

Your project includes `.env.local` configured with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

### 3. Run Development Server

```bash
npm run dev
```

- **Application**: [http://localhost:3000](http://localhost:3000)
- **Health Check API**: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Queues API**: [http://localhost:3000/api/queues](http://localhost:3000/api/queues)
- **Tasks API**: [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks)

---

## 🛠️ Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server on `http://localhost:3000` with Turbopack |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Runs the built production server |
| `npm run lint` | Runs ESLint |

---

## 🔌 Next.js API Routes Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns server health status, framework details, and Supabase latency ping |
| `GET` | `/api/queues` | Retrieves all evaluation queues from Supabase |
| `GET` | `/api/tasks` | Retrieves all evaluation tasks with their field comparisons |
| `PUT` | `/api/tasks/[id]` | Updates a task (status, assignee, field decisions, and notes) in Supabase |
