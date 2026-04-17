"use client";

import { useMemo, useState } from "react";

type Course = {
  id: string;
  title: string;
  category: string;
  progress: number;
  status: string;
  cohort: string;
  date: string;
};

type Notification = {
  id: string;
  title: string;
  details: string;
  duration: string;
  due: string;
};

type Session = {
  id: string;
  subject: string;
  description: string;
  start: string;
  coach: string;
};

type Task = {
  id: string;
  batch: string;
  course: string;
  chapter: string;
  title: string;
  threshold: string;
  completion: string;
  status: "COMPLETE" | "ABSENT" | "PENDING";
  type: "Milestone" | "Homework" | "Test";
};

type Doubt = {
  id: string;
  title: string;
  asked: string;
  status: "UNANSWERED" | "CLOSED";
};

type Submission = {
  id: string;
  title: string;
  chapter: string;
  submittedOn: string;
  status: "STARTED" | "FINISHED";
  score: string;
};

type FilterKey = "course" | "cohort" | "subject" | "type";

type Scoreline = {
  subject: string;
  correct: number;
  partial: number;
  wrong: number;
  skipped: number;
  learned: number;
};

const navItems = [
  { id: "study", label: "Study", icon: "S" },
  { id: "doubts", label: "Doubts", icon: "?" },
  { id: "performance", label: "Performance", icon: "P" },
  { id: "submissions", label: "Submissions", icon: "Sub" },
  { id: "milestones", label: "My Milestones", icon: "M" },
  { id: "errorbook", label: "Error Book", icon: "E" },
];

const courses: Course[] = [
  {
    id: "bridge",
    title: "BRIDGE COURSE 25-26",
    category: "Bridge Course",
    progress: 0,
    status: "Not Started yet",
    cohort: "Bridge Course",
    date: "N/A",
  },
  {
    id: "nvm",
    title: "NVEM 26-28",
    category: "Engineering and Medical",
    progress: 29.5,
    status: "In Progress",
    cohort: "NVEM 26-28",
    date: "17 Apr, 2026",
  },
];

const notifications: Notification[] = [
  {
    id: "chemistry",
    title: "Mole Concept milestone",
    details:
      "CCT 02 of 07 - Mole concept (Compulsory). Please attempt it by Tuesday. Read Stoichiometry and Limiting Reagent before class.",
    duration: "~15 minutes",
    due: "Do complete this work before 21-Apr-2026 23:59",
  },
  {
    id: "instructions",
    title: "Instructions - 17 Apr - 11 Saandepani Chemistry",
    details:
      "Revise class notes, review solved examples. Attempt DPP-1: 13 & 19; DPP-2: all questions; JEE/NEET exercises Q.N 8-24 & Q.N 26.",
    duration: "~20 minutes",
    due: "Suggested before next class",
  },
];

const sessions: Session[] = [
  {
    id: "session-1",
    subject: "Chemistry",
    description: "In-class Quiz - Mole Concept - B1 And B2",
    start: "Apr 17, 2026 8:00 AM",
    coach: "Divyanshu T",
  },
  {
    id: "session-2",
    subject: "Physics",
    description: "In-class Quiz - Kinematics",
    start: "Apr 16, 2026 8:00 AM",
    coach: "Ronit Kumar",
  },
  {
    id: "session-3",
    subject: "Physics",
    description: "In-class Quiz - Kinematics",
    start: "Apr 16, 2026 8:00 AM",
    coach: "Ronit Kumar",
  },
  {
    id: "session-4",
    subject: "Maths",
    description: "In-class Quiz - Interval, Inequality and Wavy Curve",
    start: "Apr 15, 2026 8:00 AM",
    coach: "Tharun Kumar",
  },
  {
    id: "session-5",
    subject: "Chemistry",
    description: "In-class Quiz - Chemical Bonding - B1 And B2",
    start: "Apr 14, 2026 8:00 AM",
    coach: "Narendranath Sen",
  },
];

const tasks: Task[] = [
  {
    id: "task-1",
    batch: "Safs 26-28 Eng1 B1",
    course: "Nvem 26-28",
    chapter: "Mole Concept",
    title: "CCT 02 of 07 - Mole concept",
    threshold: "Apr 21, 2026 11:59 PM",
    completion: "N/A",
    status: "ABSENT",
    type: "Milestone",
  },
  {
    id: "task-2",
    batch: "Saf Blr Sg 26-28 Em1p P1",
    course: "Nvem 26-28",
    chapter: "Mathematical Tools",
    title: "CCT 03 of 05 - Logarithmic basics",
    threshold: "Apr 15, 2026 11:59 PM",
    completion: "Apr 14, 2026 7:01 AM",
    status: "COMPLETE",
    type: "Milestone",
  },
  {
    id: "task-3",
    batch: "Saf Blr Sg 26-28 Em1p P1",
    course: "Nvem 26-28",
    chapter: "Units And Measurements",
    title: "CCT 03 of 03 - Error Analysis and Combination",
    threshold: "Apr 15, 2026 11:59 PM",
    completion: "Apr 14, 2026 7:00 AM",
    status: "COMPLETE",
    type: "Milestone",
  },
];

const pendingTests = [
  { id: "pt-1", course: "NVEM 26-28", cohort: "B1", subject: "Physics", type: "Mock", name: "Kinematics practice" },
  {
    id: "pt-2",
    course: "NVEM 26-28",
    cohort: "B1",
    subject: "Chemistry",
    type: "CCT",
    name: "Mole Concept drill",
  },
  { id: "pt-3", course: "NVEM 26-28", cohort: "B2", subject: "Maths", type: "Assignment", name: "Logarithmic tools" },
];

const doubts: Doubt[] = [
  {
    id: "doubt-1",
    title: "Module PDF not uploaded",
    asked: "Apr 16, 2026",
    status: "UNANSWERED",
  },
  {
    id: "doubt-2",
    title: "Detailed solution not uploaded",
    asked: "Apr 14, 2026",
    status: "CLOSED",
  },
];

const submissions: Submission[] = [
  {
    id: "sub-1",
    title: "Interval",
    chapter: "Logarithms",
    submittedOn: "Mar 30, 2026 6:54 AM",
    status: "STARTED",
    score: "0/0",
  },
  {
    id: "sub-2",
    title: "Basic Calculus",
    chapter: "Mathematical Tools",
    submittedOn: "N/A",
    status: "STARTED",
    score: "5.5/9",
  },
  {
    id: "sub-3",
    title: "Indefinite integration Lec 1",
    chapter: "Mathematical Tools",
    submittedOn: "N/A",
    status: "STARTED",
    score: "0/0",
  },
  {
    id: "sub-4",
    title: "Module - Units and Measurements (26-27)",
    chapter: "Units and Measurements",
    submittedOn: "Mar 30, 2026 6:54 AM",
    status: "STARTED",
    score: "N/A",
  },
];

const analysis: Scoreline[] = [
  { subject: "Physics", correct: 40, partial: 0, wrong: 1, skipped: 0, learned: 0 },
  { subject: "Chemistry", correct: 22, partial: 0, wrong: 0, skipped: 0, learned: 0 },
  { subject: "Maths", correct: 19, partial: 0, wrong: 0, skipped: 0, learned: 0 },
];

function Switch({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="group flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
      onClick={onToggle}
      type="button"
    >
      <span className="font-medium">{label}</span>
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          active ? "bg-blue-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${
            active ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

function ProgressBar({ value }: { value: number }) {
  const width = Math.min(Math.max(value, 0), 100);
  return (
    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 transition-[width]"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-slate-100">
      <span className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <span className="text-2xl font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white/95 p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const [enabled, setEnabled] = useState({
    notifications: true,
    webcam: false,
    screen: false,
  });
  const [search, setSearch] = useState("");
  const [taskFilters, setTaskFilters] = useState({
    course: "All",
    cohort: "All",
    subject: "All",
    type: "All",
    hideComplete: false,
  });

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.title.toLowerCase().includes(search.toLowerCase()) ||
          course.category.toLowerCase().includes(search.toLowerCase()) ||
          course.cohort.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (taskFilters.hideComplete && task.status === "COMPLETE") return false;
        if (taskFilters.course !== "All" && task.course !== taskFilters.course) return false;
        if (taskFilters.cohort !== "All" && !task.batch.toLowerCase().includes(taskFilters.cohort.toLowerCase()))
          return false;
        if (taskFilters.subject !== "All" && !task.chapter.toLowerCase().includes(taskFilters.subject.toLowerCase()))
          return false;
        if (taskFilters.type !== "All" && task.type !== taskFilters.type) return false;
        if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [taskFilters, search],
  );

  const filteredTests = useMemo(
    () =>
      pendingTests.filter(
        (test) =>
          (taskFilters.course === "All" || test.course === taskFilters.course) &&
          (taskFilters.cohort === "All" || test.cohort === taskFilters.cohort) &&
          (taskFilters.subject === "All" || test.subject === taskFilters.subject) &&
          (taskFilters.type === "All" || test.type === taskFilters.type) &&
          (search === "" || test.name.toLowerCase().includes(search.toLowerCase())),
      ),
    [taskFilters, search],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f8ff] via-[#eef4ff] to-[#f5f7f3] pb-14">
      <div className="absolute inset-x-0 top-0 h-64 -translate-y-20 bg-gradient-to-br from-[#dfe9ff] via-transparent to-[#d9f0ff] opacity-70 blur-3xl" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-100 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-lg font-semibold text-white shadow-md">
              DL
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Deeple - Study Portal</p>
              <h1 className="text-xl font-semibold text-slate-900">Welcome back, Advaith V.</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Switch
              label="Notifications"
              active={enabled.notifications}
              onToggle={() => setEnabled((s) => ({ ...s, notifications: !s.notifications }))}
            />
            <Switch label="Webcam" active={enabled.webcam} onToggle={() => setEnabled((s) => ({ ...s, webcam: !s.webcam }))} />
            <Switch
              label="Screen Share"
              active={enabled.screen}
              onToggle={() => setEnabled((s) => ({ ...s, screen: !s.screen }))}
            />
              <div className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-md">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                Live Focus Mode
              </div>
            </div>
          </header>

        <div className="grid grid-cols-[220px,1fr] gap-6 max-lg:grid-cols-1">
          <aside className="sticky top-6 flex flex-col gap-4 rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  idx === 0 ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100" : "text-slate-700 hover:bg-slate-50"
                }`}
                type="button"
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </span>
                {idx === 0 && <span className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-600">Active</span>}
              </button>
            ))}
            <div className="mt-2 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-5 text-white shadow-lg">
              <p className="text-sm font-semibold">Quick Peek</p>
              <p className="mt-2 text-3xl font-semibold">7</p>
              <p className="text-sm text-blue-100">sessions scheduled this week</p>
              <div className="mt-4 flex items-center justify-between text-xs text-blue-50">
                <span>Stay on track</span>
                <span className="rounded-full bg-white/20 px-3 py-1 font-semibold">Go</span>
              </div>
            </div>
          </aside>

          <main className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              {["My Courses", "Notifications", "Sessions", "Pending Tasks"].map((label, idx) => (
                <span
                  key={label}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-slate-200 ${
                    idx === 0 ? "bg-slate-900 text-white ring-slate-900/10" : "bg-white text-slate-700"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  {label}
                </span>
              ))}
              <div className="ml-auto flex w-full max-w-xs items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses, tasks, tests..."
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatPill label="Active Courses" value="2" />
              <StatPill label="Milestones" value="3 open / 2 done" />
              <StatPill label="Sessions" value="5 upcoming" />
            </div>

            <Card
              title="My Courses"
              action={<button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</button>}
            >
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-600">{course.status}</p>
                        <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                        <p className="text-sm text-slate-500">{course.category}</p>
                      </div>
                      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700">
                        &gt;
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{course.date}</span>
                      <span className="font-semibold text-slate-700">{course.progress.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={course.progress} />
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Notifications"
              action={
                <button className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">
                  Acknowledge all
                </button>
              }
            >
              <div className="space-y-3">
                {notifications.map((note) => (
                  <div
                    key={note.id}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                        <p className="text-sm text-slate-600">{note.details}</p>
                      </div>
                      <button className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Ready
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">{note.duration}</span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">{note.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Sessions with Quiz">
              <div className="overflow-hidden rounded-2xl border border-slate-100">
                <div className="grid grid-cols-[1.2fr,2fr,1.5fr,1fr,0.6fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 max-md:hidden">
                  <span>Subject</span>
                  <span>Description</span>
                  <span>Planned Start</span>
                  <span>Coach</span>
                  <span>Action</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="grid grid-cols-[1.2fr,2fr,1.5fr,1fr,0.6fr] items-center px-4 py-3 text-sm text-slate-700 max-md:grid-cols-1 max-md:gap-2"
                    >
                      <span className="font-semibold text-slate-900">{session.subject}</span>
                      <span>{session.description}</span>
                      <span className="text-slate-500">{session.start}</span>
                      <span className="text-slate-600">{session.coach}</span>
                      <div className="flex justify-end max-md:justify-start">
                        <button className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow hover:bg-blue-700">
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card
              title="Pending Tasks & Milestones"
              action={
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={taskFilters.hideComplete}
                      onChange={(e) => setTaskFilters((s) => ({ ...s, hideComplete: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Hide completed
                  </label>
                </div>
              }
            >
              <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-3">
                {(
                  [
                    { key: "course", label: "Select Course *", options: ["All", "Nvem 26-28"] },
                    { key: "cohort", label: "Select Cohort *", options: ["All", "B1", "B2"] },
                    { key: "subject", label: "Select Subject", options: ["All", "Physics", "Chemistry", "Maths"] },
                    { key: "type", label: "Select Test Type", options: ["All", "Milestone", "Homework", "Test"] },
                  ] as { key: FilterKey; label: string; options: string[] }[]
                ).map((filter) => (
                  <div key={filter.key} className="flex-1 min-w-[180px]">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {filter.label}
                    </label>
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={taskFilters[filter.key]}
                      onChange={(e) =>
                        setTaskFilters((s) => ({ ...s, [filter.key]: e.target.value }))
                      }
                    >
                      {filter.options.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                    onClick={() =>
                      setTaskFilters({ course: "All", cohort: "All", subject: "All", type: "All", hideComplete: false })
                    }
                  >
                    Clear Filters
                  </button>
                  <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800">
                    Apply Filters
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
                <div className="grid grid-cols-[1.2fr,1.2fr,1fr,1.8fr,1.5fr,1.3fr,0.9fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 max-lg:hidden">
                  <span>Batch</span>
                  <span>Course</span>
                  <span>Chapter</span>
                  <span>Title</span>
                  <span>Threshold</span>
                  <span>Completion</span>
                  <span>Status</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="grid grid-cols-[1.2fr,1.2fr,1fr,1.8fr,1.5fr,1.3fr,0.9fr] items-center px-4 py-3 text-sm text-slate-700 max-lg:grid-cols-1 max-lg:gap-2"
                    >
                      <span className="font-semibold text-slate-900">{task.batch}</span>
                      <span>{task.course}</span>
                      <span>{task.chapter}</span>
                      <span>{task.title}</span>
                      <span className="text-slate-500">{task.threshold}</span>
                      <span className="text-slate-500">{task.completion}</span>
                      <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          task.status === "COMPLETE"
                            ? "bg-emerald-100 text-emerald-700"
                            : task.status === "ABSENT"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">Pending Tests</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {filteredTests.length} listed
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {filteredTests.map((test) => (
                    <div
                      key={test.id}
                      className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">{test.type}</span>
                      <span className="font-semibold text-slate-900">{test.name}</span>
                      <div className="flex gap-3 text-xs text-slate-500">
                        <span>{test.course}</span>
                        <span>| Cohort {test.cohort}</span>
                        <span>| {test.subject}</span>
                      </div>
                    </div>
                  ))}
                  {filteredTests.length === 0 && (
                    <p className="text-sm text-slate-500">No tests match the current filters.</p>
                  )}
                </div>
              </div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card title="Doubts (2)">
                <div className="divide-y divide-slate-100">
                  {doubts.map((doubt) => (
                    <div key={doubt.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{doubt.title}</p>
                        <p className="text-xs text-slate-500">Asked {doubt.asked}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          doubt.status === "UNANSWERED"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {doubt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Performance (Beta)">
                <div className="space-y-3">
                  {analysis.map((entry) => {
                    const total =
                      entry.correct + entry.partial + entry.wrong + entry.skipped + entry.learned;
                    const percent = Math.round((entry.correct / Math.max(total, 1)) * 100);
                    return (
                      <div key={entry.subject} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-900 shadow-sm">
                              {entry.subject[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{entry.subject}</p>
                              <p className="text-xs text-slate-500">{percent}% correct</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {entry.correct} correct
                          </span>
                        </div>
                        <ProgressBar value={percent} />
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">
                            Correct {entry.correct}
                          </span>
                          <span className="rounded-full bg-orange-100 px-2 py-1 font-semibold text-orange-700">
                            Wrong {entry.wrong}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                            Skipped {entry.skipped}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <Card title="My Submissions">
              <div className="divide-y divide-slate-100">
                {submissions.map((submission) => (
                  <div key={submission.id} className="grid grid-cols-[1.4fr,1.4fr,1.4fr,1fr,0.8fr] items-center gap-3 py-3 max-lg:grid-cols-1">
                    <div>
                      <p className="font-semibold text-slate-900">{submission.title}</p>
                      <p className="text-xs text-slate-500">{submission.chapter}</p>
                    </div>
                    <p className="text-sm text-slate-500">{submission.submittedOn}</p>
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">{submission.score}</span>
                    </div>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        submission.status === "FINISHED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {submission.status}
                    </span>
                    <button className="justify-self-end rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800 max-lg:justify-self-start">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Error Book">
              <div className="grid gap-3">
                {analysis.map((entry) => (
                  <div key={entry.subject} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-900 shadow-sm">
                          {entry.subject[0]}
                        </div>
                        <p className="font-semibold text-slate-900">{entry.subject}</p>
                      </div>
                      <a className="text-sm font-semibold text-blue-600 hover:text-blue-700" href="#">
                        View ( {entry.correct + entry.wrong + entry.partial} )
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
