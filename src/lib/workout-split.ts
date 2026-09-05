import type { Objetivo } from "@/lib/user-store";

export type Exercise = { name: string; sets: string; rest: string };

export type SimpleWorkout = {
  name: string;
  tag: string;
  focus: string;
  duration: string;
  level: string;
  rest?: boolean;
  exercises: Exercise[];
};

/** Plano de 7 dias — emagrecimento (academia + casa). */
const EMAGRECIMENTO: SimpleWorkout[] = [
  {
    name: "Descanso e recuperação",
    tag: "off",
    focus: "Sono • Hidratação • Mobilidade",
    duration: "Livre",
    level: "Recuperação",
    rest: true,
    exercises: [
    ],
  },
  {
    name: "Full body + cardio",
    tag: "🏋️",
    focus: "Academia • Full body + cardio",
    duration: "60 min",
    level: "Moderado",
    exercises: [
      { name: "Agachamento livre/goblet", sets: "3 x 10-12", rest: "60s" },
      { name: "Supino máquina/flexão", sets: "3 x 10-12", rest: "60s" },
      { name: "Remada baixa/elástico", sets: "3 x 10-12", rest: "60s" },
      { name: "Elevação pélvica", sets: "3 x 12-15", rest: "60s" },
      { name: "Cardio moderado", sets: "25 min", rest: "-" },
    ],
  },
  {
    name: "Circuito metabólico",
    tag: "🏠",
    focus: "Casa • Circuito metabólico",
    duration: "60 min",
    level: "Moderado",
    exercises: [
      { name: "Agachamento", sets: "4 x 15", rest: "30s" },
      { name: "Flexão", sets: "4 x 8-15", rest: "30s" },
      { name: "Afundo alternado", sets: "4 x 10/cada", rest: "30s" },
      { name: "Mountain climber", sets: "4 x 30s", rest: "30s" },
      { name: "Prancha", sets: "3 x 30-45s", rest: "30s" },
    ],
  },
  {
    name: "Descanso e recuperação",
    tag: "off",
    focus: "Sono • Hidratação • Mobilidade",
    duration: "Livre",
    level: "Recuperação",
    rest: true,
    exercises: [
    ],
  },
  {
    name: "Pernas + cardio",
    tag: "🏋️",
    focus: "Academia • Pernas + cardio",
    duration: "60 min",
    level: "Moderado",
    exercises: [
      { name: "Leg press", sets: "3 x 12", rest: "60s" },
      { name: "Cadeira extensora", sets: "3 x 12-15", rest: "45s" },
      { name: "Mesa flexora", sets: "3 x 12-15", rest: "45s" },
      { name: "Panturrilha", sets: "3 x 15-20", rest: "45s" },
      { name: "Cardio moderado", sets: "30 min", rest: "-" },
    ],
  },
  {
    name: "HIIT leve/moderado",
    tag: "🏠",
    focus: "Casa • HIIT leve/moderado",
    duration: "60 min",
    level: "Moderado",
    exercises: [
      { name: "Polichinelo", sets: "4 x 40s", rest: "20s" },
      { name: "Agachamento", sets: "4 x 15", rest: "20s" },
      { name: "Flexão", sets: "4 x 8-12", rest: "30s" },
      { name: "Corrida parada", sets: "4 x 40s", rest: "20s" },
      { name: "Prancha", sets: "3 x 40s", rest: "30s" },
    ],
  },
  {
    name: "Cardio + core",
    tag: "🔁",
    focus: "Academia/Casa • Cardio + core",
    duration: "42 min",
    level: "Moderado",
    exercises: [
      { name: "Caminhada/corrida/bike", sets: "35-45 min", rest: "-" },
      { name: "Abdominal", sets: "3 x 15-20", rest: "30s" },
      { name: "Prancha lateral", sets: "3 x 30s/lado", rest: "30s" },
    ],
  },
];

/** Plano de 7 dias — foco na academia (força + core). */
const PERFORMANCE: SimpleWorkout[] = [
  {
    name: "Descanso e recuperação",
    tag: "off",
    focus: "Sono • Hidratação • Mobilidade",
    duration: "Livre",
    level: "Recuperação",
    rest: true,
    exercises: [
    ],
  },
  {
    name: "Peito + tríceps",
    tag: "🏋️",
    focus: "Academia • Peito + tríceps",
    duration: "60 min",
    level: "Intermediário",
    exercises: [
      { name: "Supino reto", sets: "4 x 8-12", rest: "75s" },
      { name: "Supino inclinado", sets: "3 x 10-12", rest: "60s" },
      { name: "Crucifixo/crossover", sets: "3 x 12-15", rest: "60s" },
      { name: "Tríceps corda", sets: "3 x 10-15", rest: "60s" },
      { name: "Tríceps francês", sets: "3 x 10-12", rest: "60s" },
    ],
  },
  {
    name: "Push + core",
    tag: "🏠",
    focus: "Casa • Push + core",
    duration: "60 min",
    level: "Intermediário",
    exercises: [
      { name: "Flexão tradicional", sets: "4 x 8-15", rest: "60s" },
      { name: "Flexão inclinada", sets: "3 x 10-15", rest: "45s" },
      { name: "Tríceps no banco", sets: "3 x 10-15", rest: "45s" },
      { name: "Prancha", sets: "3 x 45s", rest: "30s" },
      { name: "Abdominal bicicleta", sets: "3 x 15/lado", rest: "30s" },
    ],
  },
  {
    name: "Descanso e recuperação",
    tag: "off",
    focus: "Sono • Hidratação • Mobilidade",
    duration: "Livre",
    level: "Recuperação",
    rest: true,
    exercises: [
    ],
  },
  {
    name: "Costas + bíceps",
    tag: "🏋️",
    focus: "Academia • Costas + bíceps",
    duration: "60 min",
    level: "Intermediário",
    exercises: [
      { name: "Puxada frontal", sets: "4 x 8-12", rest: "75s" },
      { name: "Remada baixa", sets: "3 x 10-12", rest: "60s" },
      { name: "Remada unilateral", sets: "3 x 10/cada", rest: "60s" },
      { name: "Rosca direta", sets: "3 x 10-12", rest: "60s" },
      { name: "Rosca martelo", sets: "3 x 10-12", rest: "60s" },
    ],
  },
  {
    name: "Pull + core",
    tag: "🏠",
    focus: "Casa • Pull + core",
    duration: "60 min",
    level: "Intermediário",
    exercises: [
      { name: "Remada com elástico/mochila", sets: "4 x 10-15", rest: "60s" },
      { name: "Rosca com elástico/mochila", sets: "3 x 10-15", rest: "45s" },
      { name: "Superman", sets: "3 x 12-15", rest: "45s" },
      { name: "Prancha", sets: "3 x 45s", rest: "30s" },
      { name: "Dead bug", sets: "3 x 10/lado", rest: "30s" },
    ],
  },
  {
    name: "Pernas + condicionamento",
    tag: "🔁",
    focus: "Academia/Casa • Pernas + condicionamento",
    duration: "60 min",
    level: "Intermediário",
    exercises: [
      { name: "Agachamento", sets: "4 x 8-12", rest: "75s" },
      { name: "Leg press / afundo", sets: "3 x 10-12", rest: "60s" },
      { name: "Stiff", sets: "3 x 10-12", rest: "60s" },
      { name: "Panturrilha", sets: "3 x 15-20", rest: "45s" },
      { name: "Cardio", sets: "20-30 min", rest: "-" },
    ],
  },
];

/** Plano de 7 dias — massa muscular (academia + casa). */
const MASSA: SimpleWorkout[] = [
  {
    name: "Descanso e recuperação",
    tag: "off",
    focus: "Sono • Hidratação • Mobilidade",
    duration: "Livre",
    level: "Recuperação",
    rest: true,
    exercises: [
    ],
  },
  {
    name: "Peito + tríceps",
    tag: "🏋️",
    focus: "Academia • Peito + tríceps",
    duration: "60 min",
    level: "Avançado",
    exercises: [
      { name: "Supino reto", sets: "4 x 6-10", rest: "90s" },
      { name: "Supino inclinado", sets: "3 x 8-12", rest: "75s" },
      { name: "Crossover", sets: "3 x 10-15", rest: "60s" },
      { name: "Tríceps testa", sets: "3 x 8-12", rest: "75s" },
      { name: "Tríceps corda", sets: "3 x 10-15", rest: "60s" },
    ],
  },
  {
    name: "Peito + braços",
    tag: "🏠",
    focus: "Casa • Peito + braços",
    duration: "60 min",
    level: "Avançado",
    exercises: [
      { name: "Flexão com mochila", sets: "4 x 8-15", rest: "75s" },
      { name: "Flexão fechada", sets: "3 x 8-12", rest: "60s" },
      { name: "Rosca com mochila/elástico", sets: "4 x 10-15", rest: "60s" },
      { name: "Tríceps no banco", sets: "3 x 10-15", rest: "60s" },
      { name: "Abdominal", sets: "3 x 15-20", rest: "45s" },
    ],
  },
  {
    name: "Descanso e recuperação",
    tag: "off",
    focus: "Sono • Hidratação • Mobilidade",
    duration: "Livre",
    level: "Recuperação",
    rest: true,
    exercises: [
    ],
  },
  {
    name: "Costas + bíceps",
    tag: "🏋️",
    focus: "Academia • Costas + bíceps",
    duration: "60 min",
    level: "Avançado",
    exercises: [
      { name: "Puxada frontal", sets: "4 x 6-10", rest: "90s" },
      { name: "Remada curvada", sets: "4 x 8-12", rest: "90s" },
      { name: "Remada baixa", sets: "3 x 10-12", rest: "75s" },
      { name: "Rosca direta", sets: "3 x 8-12", rest: "75s" },
      { name: "Rosca martelo", sets: "3 x 10-12", rest: "60s" },
    ],
  },
  {
    name: "Costas + braços",
    tag: "🏠",
    focus: "Casa • Costas + braços",
    duration: "60 min",
    level: "Avançado",
    exercises: [
      { name: "Remada com mochila", sets: "4 x 8-15", rest: "75s" },
      { name: "Pullover com mochila", sets: "3 x 10-15", rest: "60s" },
      { name: "Rosca unilateral", sets: "3 x 10-15", rest: "60s" },
      { name: "Flexão fechada", sets: "3 x 8-15", rest: "60s" },
      { name: "Prancha", sets: "3 x 45-60s", rest: "30s" },
    ],
  },
  {
    name: "Pernas + glúteos",
    tag: "🔁",
    focus: "Academia/Casa • Pernas + glúteos",
    duration: "60 min",
    level: "Avançado",
    exercises: [
      { name: "Agachamento", sets: "4 x 6-10", rest: "90s" },
      { name: "Leg press / afundo", sets: "3 x 8-12", rest: "75s" },
      { name: "Stiff", sets: "3 x 8-12", rest: "75s" },
      { name: "Elevação pélvica", sets: "4 x 8-12", rest: "75s" },
      { name: "Panturrilha", sets: "4 x 12-20", rest: "60s" },
    ],
  },
];

export const WORKOUT_PLANS: Record<Objetivo, SimpleWorkout[]> = {
  emagrecimento: EMAGRECIMENTO,
  "ganho de massa muscular": MASSA,
  foco: PERFORMANCE,
};

export const PLAN_LABELS: Record<Objetivo, string> = {
  emagrecimento: "Plano Emagrecimento — 7 dias (academia + casa)",
  "ganho de massa muscular": "Plano Massa Muscular — 7 dias (academia + casa)",
  foco: "Plano Foco na Academia — 7 dias",
};

/** Weekly split for the user's goal (índice = dia da semana, 0 = domingo). */
export function splitFor(objetivo?: Objetivo | null): SimpleWorkout[] {
  return WORKOUT_PLANS[objetivo ?? "ganho de massa muscular"] ?? MASSA;
}

export function planLabel(objetivo?: Objetivo | null) {
  return PLAN_LABELS[objetivo ?? "ganho de massa muscular"] ?? PLAN_LABELS["ganho de massa muscular"];
}

export function workoutForDay(dayIdx: number, objetivo?: Objetivo | null): SimpleWorkout {
  const plan = splitFor(objetivo);
  return plan[((dayIdx % 7) + 7) % 7]!;
}

export const WEEK_LABELS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
