"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Role = "student" | "teacher" | "admin";

const roleMeta: Record<
  Role,
  { title: string; description: string; badge: string; color: string; checklist: string[] }
> = {
  student: {
    title: "Learner",
    description: "Access courses, join live classes, submit quizzes, and track milestones.",
    badge: "Student Access",
    color: "from-blue-500 to-indigo-600",
    checklist: ["Submit class code or OTP", "Enable notifications for reminders", "Keep camera/screen ready for proctoring"],
  },
  teacher: {
    title: "Teacher",
    description: "Launch quizzes, unlock solutions, monitor live attendance, and approve reattempts.",
    badge: "Teacher Tools",
    color: "from-emerald-500 to-teal-600",
    checklist: ["Verify staff email", "Add class key for the active batch", "Toggle invigilation mode if required"],
  },
  admin: {
    title: "Admin",
    description: "Manage cohorts, override access, and view institute-wide readiness in one view.",
    badge: "Admin Controls",
    color: "from-amber-500 to-orange-600",
    checklist: ["Use institute email", "Enter admin override code", "Review compliance and audit logs before unlock"],
  },
};

export default function LoginPage() {
  const [role, setRole] = useState<Role>("student");
  const [form, setForm] = useState({ email: "", password: "", code: "", classCode: "" });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const meta = useMemo(() => roleMeta[role], [role]);

  const requirements = useMemo(
    () => [
      { label: "Verified email domain", ready: form.email.includes("@") && form.email.split("@")[1]?.includes(".") },
      { label: "Strong password (8+ chars)", ready: form.password.trim().length >= 8 },
      {
        label: role === "student" ? "Class code / OTP" : "Staff override code",
        ready: role === "student" ? form.classCode.trim().length >= 4 : form.code.trim().length >= 4,
      },
    ],
    [form.classCode, form.code, form.email, form.password, role],
  );

  const canSubmit = requirements.every((item) => item.ready);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setStatus("error");
      setMessage("Please complete the highlighted requirements before signing in.");
      return;
    }
    setStatus("success");
    const roleLabel = role === "student" ? "Student" : role === "teacher" ? "Teacher" : "Admin";
    setMessage(`${roleLabel} login request recorded. Redirecting you to the dashboard and quiz room...`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f8ff] via-[#eef4ff] to-[#f5f7f3]">
      <div className="absolute inset-x-0 top-0 h-72 -translate-y-32 bg-gradient-to-br from-[#dfe9ff] via-transparent to-[#d9f0ff] opacity-70 blur-3xl" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-100 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Secure Access</p>
            <h1 className="text-2xl font-semibold text-slate-900">Login for Students, Teachers, and Admins</h1>
            <p className="text-sm text-slate-600">
              Pick your role, satisfy the guardrails, and you will land on the live dashboard with quiz access.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
            >
              Back to dashboard
            </Link>
            <Link
              href="/quiz"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Go to quiz room
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(roleMeta) as Role[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setRole(item)}
                  className={`group rounded-2xl border px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    role === item ? "border-blue-500/60 bg-blue-50/70" : "border-slate-200 bg-white"
                  }`}
                  type="button"
                >
                  <div
                    className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white ${
                      roleMeta[item].color
                    } shadow-sm`}
                  >
                    {roleMeta[item].badge}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{roleMeta[item].title}</p>
                  <p className="text-sm text-slate-600">{roleMeta[item].description}</p>
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white/95 p-5 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Sign in as {meta.title}</h2>
                  <p className="text-sm text-slate-600">Complete the gate checks to unlock the portal and in-class quizzes.</p>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white">
                  {role === "admin" ? "High Security" : role === "teacher" ? "Class Control" : "Learner"}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm font-semibold text-slate-800">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="you@institute.edu"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-semibold text-slate-800">
                  Password
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Min. 8 characters"
                    required
                  />
                </label>
                {role === "student" ? (
                  <label className="flex flex-col gap-1 text-sm font-semibold text-slate-800">
                    Class code or OTP
                    <input
                      value={form.classCode}
                      onChange={(e) => setForm((s) => ({ ...s, classCode: e.target.value }))}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Shared by your teacher"
                      required
                    />
                  </label>
                ) : (
                  <label className="flex flex-col gap-1 text-sm font-semibold text-slate-800">
                    {role === "admin" ? "Admin override code" : "Faculty access code"}
                    <input
                      value={form.code}
                      onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Required for privileged access"
                      required
                    />
                  </label>
                )}
                <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Readiness</p>
                  {requirements.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          item.ready ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      />
                      <span className={item.ready ? "text-slate-700" : "text-slate-500"}>{item.label}</span>
                    </div>
                  ))}
                  <p className="text-xs text-slate-500">
                    We use these checks to route you to the right dashboard and in-class quiz view.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={!canSubmit}
                >
                  Continue to portal
                </button>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Remember me on this device
                </label>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                  {canSubmit ? "Ready" : "Pending checks"}
                </span>
              </div>

              {status !== "idle" && (
                <div
                  className={`mt-3 flex items-start gap-3 rounded-2xl border px-3 py-2 text-sm ${
                    status === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-orange-200 bg-orange-50 text-orange-800"
                  }`}
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-current" />
                  <p>{message}</p>
                </div>
              )}
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-900 px-5 py-4 text-white shadow-lg ring-1 ring-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-100">Session guardrails</p>
                  <p className="text-lg font-semibold">Live quiz and portal safety</p>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]">
                  {meta.badge}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-blue-50">
                {meta.checklist.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-blue-100">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-xs uppercase tracking-[0.12em]">Live rooms</p>
                  <p className="text-base font-semibold text-white">03 open</p>
                  <p>Physics, Chemistry, Maths</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-xs uppercase tracking-[0.12em]">Quiz kits</p>
                  <p className="text-base font-semibold text-white">9 questions</p>
                  <p>Mapped to in-class sessions</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/95 p-5 shadow-sm ring-1 ring-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Shortcuts</h2>
              <div className="mt-3 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">Resume in-class quiz</p>
                    <p className="text-xs text-slate-500">Land directly in the quiz room with saved responses.</p>
                  </div>
                  <Link href="/quiz" className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-blue-700">
                    Open
                  </Link>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">Switch role quickly</p>
                    <p className="text-xs text-slate-500">Teacher and admin can re-auth without losing session data.</p>
                  </div>
                  <button
                    onClick={() => {
                      setRole(role === "admin" ? "teacher" : "admin");
                      setStatus("idle");
                    }}
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-slate-800"
                    type="button"
                  >
                    Swap role
                  </button>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-900">Compliance pulse</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-600">
                    <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
                      <p className="uppercase tracking-[0.1em] text-slate-500">Attendance</p>
                      <p className="text-sm font-semibold text-slate-900">96%</p>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
                      <p className="uppercase tracking-[0.1em] text-slate-500">Quiz ready</p>
                      <p className="text-sm font-semibold text-slate-900">All sets</p>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
                      <p className="uppercase tracking-[0.1em] text-slate-500">Proctoring</p>
                      <p className="text-sm font-semibold text-slate-900">Optional</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
