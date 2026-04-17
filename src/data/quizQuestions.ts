export type QuizQuestion = {
  id: string;
  sessionId: string;
  subject: string;
  topic: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  difficulty: "Easy" | "Medium" | "Hard";
  rationale: string;
  estimatedTime: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "chem-1",
    sessionId: "session-1",
    subject: "Chemistry",
    topic: "Mole Concept",
    prompt: "One mole of sodium chloride contains how many formula units?",
    options: ["6.022 x 10^20", "6.022 x 10^23", "1.602 x 10^19", "3.011 x 10^23"],
    correctIndex: 1,
    difficulty: "Easy",
    rationale: "A mole of any substance contains Avogadro's number (6.022 x 10^23) of elementary units.",
    estimatedTime: "45s",
  },
  {
    id: "chem-2",
    sessionId: "session-1",
    subject: "Chemistry",
    topic: "Stoichiometry",
    prompt: "Which statement about limiting reagents is true?",
    options: [
      "Excess reagent always determines product amount",
      "Limiting reagent stops the reaction when consumed",
      "Catalysts are always limiting reagents",
      "Limiting reagent is the one present in the largest amount",
    ],
    correctIndex: 1,
    difficulty: "Medium",
    rationale: "The limiting reagent is consumed first and therefore limits the amount of product formed.",
    estimatedTime: "60s",
  },
  {
    id: "chem-3",
    sessionId: "session-1",
    subject: "Chemistry",
    topic: "Stoichiometry",
    prompt: "In a balanced reaction, the mole ratio comes from:",
    options: ["Experimental yield", "Subscripts of reactants only", "Coefficients of the balanced equation", "Empirical formula"],
    correctIndex: 2,
    difficulty: "Easy",
    rationale: "The coefficients in a balanced chemical equation provide mole ratios for stoichiometric calculations.",
    estimatedTime: "50s",
  },
  {
    id: "phys-1",
    sessionId: "session-2",
    subject: "Physics",
    topic: "Kinematics",
    prompt: "A particle accelerates uniformly from rest to 20 m/s in 5 s. Its acceleration is:",
    options: ["2 m/s^2", "4 m/s^2", "5 m/s^2", "10 m/s^2"],
    correctIndex: 1,
    difficulty: "Easy",
    rationale: "Acceleration a = (v - u)/t = (20 - 0)/5 = 4 m/s^2.",
    estimatedTime: "40s",
  },
  {
    id: "phys-2",
    sessionId: "session-2",
    subject: "Physics",
    topic: "Kinematics",
    prompt: "Displacement for uniform acceleration can be found using:",
    options: ["s = ut", "s = vt", "s = ut + 1/2 at^2", "s = at"],
    correctIndex: 2,
    difficulty: "Easy",
    rationale: "The standard equation for displacement under constant acceleration is s = ut + 1/2 at^2.",
    estimatedTime: "45s",
  },
  {
    id: "phys-3",
    sessionId: "session-2",
    subject: "Physics",
    topic: "Kinematics Graphs",
    prompt: "The slope of a velocity-time graph represents:",
    options: ["Velocity", "Displacement", "Acceleration", "Jerk"],
    correctIndex: 2,
    difficulty: "Medium",
    rationale: "For v-t graphs, the slope is acceleration and the area under the curve is displacement.",
    estimatedTime: "35s",
  },
  {
    id: "math-1",
    sessionId: "session-4",
    subject: "Maths",
    topic: "Inequalities",
    prompt: "For quadratic ax^2 + bx + c = 0 with discriminant D > 0, which is true about the roots?",
    options: [
      "Two equal real roots",
      "Two distinct real roots",
      "Two complex conjugate roots",
      "One real, one complex root",
    ],
    correctIndex: 1,
    difficulty: "Easy",
    rationale: "D > 0 implies two distinct real roots; D = 0 implies equal roots; D < 0 implies complex conjugates.",
    estimatedTime: "40s",
  },
  {
    id: "math-2",
    sessionId: "session-4",
    subject: "Maths",
    topic: "Intervals",
    prompt: "The solution to |x - 3| < 2 is:",
    options: ["x < 5", "x > 1", "1 < x < 5", "x < 1 or x > 5"],
    correctIndex: 2,
    difficulty: "Easy",
    rationale: "|x - 3| < 2 expands to -2 < x - 3 < 2, giving 1 < x < 5.",
    estimatedTime: "35s",
  },
  {
    id: "math-3",
    sessionId: "session-4",
    subject: "Maths",
    topic: "Wavy Curve",
    prompt: "Wavy curve method primarily helps with:",
    options: ["Solving linear equations", "Graphing trigonometric functions", "Finding sign of rational expressions", "Evaluating limits"],
    correctIndex: 2,
    difficulty: "Medium",
    rationale: "The wavy curve method visualizes sign changes of rational functions using roots and multiplicity.",
    estimatedTime: "55s",
  },
];

export function getQuestionsForSession(sessionId: string) {
  return quizQuestions.filter((question) => question.sessionId === sessionId);
}

export const quizSessionStats = quizQuestions.reduce<Record<string, { total: number; subject: string }>>(
  (acc, question) => {
    const existing = acc[question.sessionId];
    acc[question.sessionId] = {
      total: (existing?.total ?? 0) + 1,
      subject: existing?.subject ?? question.subject,
    };
    return acc;
  },
  {},
);
