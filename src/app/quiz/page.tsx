"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getQuestionsForSession, quizQuestions, quizSessionStats, type QuizQuestion } from "@/data/quizQuestions";

type SessionInfo = {
  id: string;
  title: string;
  coach: string;
  cohort: string;
  window: string;
  room: string;
};

const quizSessions: SessionInfo[] = [
  {
    id: "session-1",
    title: "In-class Quiz - Mole Concept",
    coach: "Divyanshu T",
    cohort: "B1",
    window: "08:00 AM",
    room: "Chem Studio",
  },
  {
    id: "session-2",
    title: "In-class Quiz - Kinematics",
    coach: "Ronit Kumar",
    cohort: "B1",
    window: "08:00 AM",
    room: "Physics Bay",
  },
  {
    id: "session-4",
    title: "In-class Quiz - Inequalities",
    coach: "Tharun Kumar",
    cohort: "B2",
    window: "08:00 AM",
    room: "Maths Pod",
  },
];

const initialAnswers = quizQuestions.reduce<Record<string, number | null>>((acc, question) => {
  acc[question.id] = null;
  return acc;
}, {});

export default function QuizPage() {
  const [activeSession, setActiveSession] = useState<string>(quizSessions[0]?.id ?? "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>(initialAnswers);
  const [proctoring, setProctoring] = useState({ webcam: false, screen: false, lockTab: true });

  const sessionQuestions = useMemo<QuizQuestion[]>(() => getQuestionsForSession(activeSession), [activeSession]);
  const currentQuestion = sessionQuestions[currentIndex] ?? sessionQuestions[0];

  const answered = sessionQuestions.filter((q) => answers[q.id] !== null).length;
  const correct = sessionQuestions.filter((q) => answers[q.id] === q.correctIndex).length;
  const progress = sessionQuestions.length ? Math.round((answered / sessionQuestions.length) * 100) : 0;
  const accuracy = sessionQuestions.length ? Math.round((correct / sessionQuestions.length) * 100) : 0;

  function recordAnswer(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function go(delta: number) {
    setCurrentIndex((idx) => {
      const next = idx + delta;
      if (next < 0) return 0;
      if (next >= sessionQuestions.length) return sessionQuestions.length - 1;
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f8ff] via-[#eef4ff] to-[#f5f7f3] pb-14">
      <div className="absolute inset-x-0 top-0 h-72 -translate-y-32 bg-gradient-to-br from-[#dfe9ff] via-transparent to-[#d9f0ff] opacity-70 blur-3xl" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 lg:px-8">
        <header className="flex flex-col gap-4 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-slate-100 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">In-class Quiz Room</p>
            <h1 className="text-2xl font-semibold text-slate-900">Launch and attempt quiz with pre-made questions</h1>
            <p className="text-sm text-slate-600">
              Built for learners, teachers, and admins with the same question kits used in live sessions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Manage login
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,1.5fr]">
          <aside className="space-y-4">
            <div className="rounded-3xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Pick your live session</h2>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white">
                  {quizSessionStats[activeSession]?.total ?? 0} Qs
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {quizSessions.map((session) => {
                  const stats = quizSessionStats[session.id];
                  const readiness = stats ? Math.round(((answersPerSession(answers, session.id) ?? 0) / stats.total) * 100) : 0;
                  return (
                    <button
                      key={session.id}
                      onClick={() => {
                        setActiveSession(session.id);
                        setCurrentIndex(0);
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                        activeSession === session.id ? "border-blue-500/60 bg-blue-50/60" : "border-slate-200 bg-white"
                      }`}
                      type="button"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{session.title}</p>
                        <p className="text-xs text-slate-500">
                          {session.cohort} cohort • {session.coach} • {session.room}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-600">
                        <p className="font-semibold text-slate-900">{stats?.subject ?? "Topic TBD"}</p>
                        <p className="text-slate-500">{readiness}% answered</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Proctoring controls</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                {[
                  { key: "webcam" as const, label: "Webcam check (optional)" },
                  { key: "screen" as const, label: "Screen share required?" },
                  { key: "lockTab" as const, label: "Lock tab switching" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={proctoring[item.key]}
                      onChange={(e) => setProctoring((s) => ({ ...s, [item.key]: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-3 rounded-2xl bg-slate-900 px-3 py-2 text-xs text-white">
                <p className="font-semibold">Teacher/Admin view</p>
                <p className="text-blue-100">Use the toggles to align with invigilation policy without blocking students.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Live stats</h3>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-600">
                <Stat label="Answered" value={`${answered}/${sessionQuestions.length || 0}`} />
                <Stat label="Correct" value={`${correct}`} />
                <Stat label="Accuracy" value={`${accuracy || 0}%`} />
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">Classroom actions</p>
                <ul className="mt-1 space-y-1 list-disc pl-4">
                  <li>Push quiz link after login</li>
                  <li>Allow one reattempt for absent students</li>
                  <li>Share solutions once 80% submissions are in</li>
                </ul>
              </div>
            </div>
          </aside>

          <main className="space-y-4">
            <div className="rounded-3xl bg-white/95 p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{sessionQuestions[0]?.subject ?? "Quiz"}</p>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {quizSessions.find((s) => s.id === activeSession)?.title ?? "Selected quiz"}
                  </h2>
                </div>
                <div className="ml-auto flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  {progress}% complete
                </div>
              </div>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {currentQuestion ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">
                      Q{currentIndex + 1} • {currentQuestion.topic}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {currentQuestion.difficulty} • {currentQuestion.estimatedTime}
                    </span>
                  </div>
                  <p className="text-base text-slate-900">{currentQuestion.prompt}</p>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, idx) => {
                      const selected = answers[currentQuestion.id] === idx;
                      const isCorrect = currentQuestion.correctIndex === idx;
                      const showState = selected && isCorrect;
                      return (
                        <button
                          key={option}
                          onClick={() => recordAnswer(currentQuestion.id, idx)}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition hover:-translate-y-0.5 hover:shadow-sm ${
                            selected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
                          }`}
                          type="button"
                        >
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                              selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 text-slate-800">{option}</span>
                          {showState && <span className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-600">Correct</span>}
                        </button>
                      );
                    })}
                  </div>
                  {answers[currentQuestion.id] !== null && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                      <p className="font-semibold">Why this answer</p>
                      <p>{currentQuestion.rationale}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-600">No questions found for this session.</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => go(-1)}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200"
                  type="button"
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>
                <button
                  onClick={() => go(1)}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                  type="button"
                  disabled={currentIndex >= sessionQuestions.length - 1}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentIndex(0)}
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                  type="button"
                >
                  Review from start
                </button>
                <span className="ml-auto text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                  {answered} answered • {sessionQuestions.length - answered} pending
                </span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Answer map</h3>
                <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                  {sessionQuestions.map((q, idx) => {
                    const value = answers[q.id];
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 shadow-sm ${
                          value !== null ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-700"
                        }`}
                        type="button"
                      >
                        <span className="font-semibold">Q{idx + 1}</span>
                        <span className="text-[11px] uppercase tracking-[0.08em]">{value !== null ? "Done" : "Open"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl bg-white/95 p-4 shadow-sm ring-1 ring-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Role-specific guidance</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                    <p className="font-semibold text-slate-900">Students</p>
                    <p className="text-xs text-slate-600">Attempt in sequence; explanations unlock after you select an option.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                    <p className="font-semibold text-slate-900">Teachers</p>
                    <p className="text-xs text-slate-600">
                      Monitor live readiness, toggle proctoring, and trigger reattempts directly from this room.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                    <p className="font-semibold text-slate-900">Admins</p>
                    <p className="text-xs text-slate-600">
                      Use stats to audit completion and align the login gate with institute compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2 text-left shadow-sm">
      <p className="uppercase tracking-[0.1em] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function answersPerSession(answerMap: Record<string, number | null>, sessionId: string) {
  const sessionIds = quizQuestions.filter((q) => q.sessionId === sessionId).map((q) => q.id);
  return sessionIds.reduce((count, id) => (answerMap[id] !== null ? count + 1 : count), 0);
}
