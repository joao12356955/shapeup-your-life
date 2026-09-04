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

/** Plano focado em queima calórica: corridas + funcionais. */
const EMAGRECIMENTO: SimpleWorkout[] = [
  {
    name: "Caminhada & Mobilidade",
    tag: "🚶",
    focus: "Recuperação ativa • Alongamento",
    duration: "40 min",
    level: "Leve",
    rest: true,
    exercises: [
      { name: "Caminhada em ritmo confortável", sets: "30 min", rest: "-" },
      { name: "Alongamento de posterior e quadril", sets: "3 x 40s", rest: "20s" },
      { name: "Respiração e mobilidade de coluna", sets: "3 x 10", rest: "30s" },
    ],
  },
  {
    name: "Corrida Intervalada",
    tag: "🏃",
    focus: "HIIT na esteira ou rua",
    duration: "40 min",
    level: "Moderado",
    exercises: [
      { name: "Aquecimento trote leve", sets: "8 min", rest: "-" },
      { name: "Tiros de 1 min forte", sets: "10 x 1 min", rest: "1 min trote" },
      { name: "Corrida contínua leve", sets: "8 min", rest: "-" },
      { name: "Prancha isométrica", sets: "3 x 40s", rest: "30s" },
    ],
  },
  {
    name: "Funcional Full Body",
    tag: "F1",
    focus: "Circuito metabólico • Corpo inteiro",
    duration: "45 min",
    level: "Moderado",
    exercises: [
      { name: "Burpee", sets: "4 x 12", rest: "40s" },
      { name: "Agachamento com salto", sets: "4 x 15", rest: "40s" },
      { name: "Swing com kettlebell", sets: "4 x 20", rest: "45s" },
      { name: "Remada baixa", sets: "3 x 15", rest: "45s" },
      { name: "Mountain climbers", sets: "4 x 40s", rest: "20s" },
      { name: "Abdominal remador", sets: "3 x 20", rest: "30s" },
    ],
  },
  {
    name: "Corrida Contínua",
    tag: "🏃",
    focus: "Zona 2 • Base aeróbica",
    duration: "45 min",
    level: "Moderado",
    exercises: [
      { name: "Corrida contínua ritmo conversável", sets: "35 min", rest: "-" },
      { name: "Subida em rampa/esteira inclinada", sets: "5 x 2 min", rest: "1 min" },
      { name: "Alongamento final", sets: "5 min", rest: "-" },
    ],
  },
  {
    name: "Funcional & Core",
    tag: "F2",
    focus: "Força funcional • Abdômen",
    duration: "40 min",
    level: "Moderado",
    exercises: [
      { name: "Afundo alternado", sets: "4 x 16", rest: "40s" },
      { name: "Flexão de braço", sets: "4 x 12", rest: "45s" },
      { name: "Step up no banco", sets: "4 x 15", rest: "40s" },
      { name: "Prancha lateral", sets: "3 x 40s cada", rest: "30s" },
      { name: "Corda naval", sets: "5 x 30s", rest: "30s" },
    ],
  },
  {
    name: "Bike ou Escada + Circuito",
    tag: "🚴",
    focus: "Cardio de baixo impacto",
    duration: "40 min",
    level: "Moderado",
    exercises: [
      { name: "Bike ergométrica moderada", sets: "25 min", rest: "-" },
      { name: "Escada / simulador", sets: "10 min", rest: "-" },
      { name: "Abdominal bicicleta", sets: "3 x 30", rest: "30s" },
    ],
  },
  {
    name: "Corrida Longa",
    tag: "🏃",
    focus: "Volume aeróbico • Queima total",
    duration: "60 min",
    level: "Desafiador",
    exercises: [
      { name: "Corrida longa em ritmo leve", sets: "50 min", rest: "-" },
      { name: "Caminhada de desaquecimento", sets: "10 min", rest: "-" },
    ],
  },
];

/** Plano clássico de hipertrofia (mantém o treino original). */
const MASSA: SimpleWorkout[] = [
  {
    name: "Descanso ativo",
    tag: "off",
    focus: "Mobilidade • Alongamento",
    duration: "30 min",
    level: "Recuperação",
    rest: true,
    exercises: [
      { name: "Alongamento dinâmico", sets: "3 x 30s", rest: "20s" },
      { name: "Caminhada leve", sets: "20 min", rest: "-" },
      { name: "Mobilidade de quadril", sets: "3 x 10", rest: "30s" },
    ],
  },
  {
    name: "Treino A",
    tag: "A",
    focus: "Peito • Ombro • Tríceps",
    duration: "60 min",
    level: "Intermediário",
    exercises: [
      { name: "Supino reto", sets: "4 x 10", rest: "75s" },
      { name: "Supino inclinado halteres", sets: "4 x 10", rest: "60s" },
      { name: "Desenvolvimento militar", sets: "4 x 10", rest: "75s" },
      { name: "Elevação lateral", sets: "3 x 15", rest: "45s" },
      { name: "Tríceps corda", sets: "4 x 12", rest: "45s" },
      { name: "Tríceps francês", sets: "3 x 12", rest: "60s" },
    ],
  },
  {
    name: "Treino B",
    tag: "B",
    focus: "Costas • Bíceps • Posterior",
    duration: "60 min",
    level: "Avançado",
    exercises: [
      { name: "Puxada frente", sets: "4 x 12", rest: "60s" },
      { name: "Remada curvada", sets: "4 x 10", rest: "75s" },
      { name: "Remada baixa", sets: "3 x 12", rest: "60s" },
      { name: "Pulldown corda", sets: "3 x 15", rest: "45s" },
      { name: "Rosca direta", sets: "4 x 10", rest: "60s" },
      { name: "Rosca martelo", sets: "3 x 12", rest: "45s" },
      { name: "Stiff", sets: "4 x 12", rest: "75s" },
    ],
  },
  {
    name: "Treino C",
    tag: "C",
    focus: "Pernas • Glúteo • Panturrilha",
    duration: "70 min",
    level: "Avançado",
    exercises: [
      { name: "Agachamento livre", sets: "4 x 10", rest: "90s" },
      { name: "Leg press", sets: "4 x 12", rest: "75s" },
      { name: "Cadeira extensora", sets: "3 x 15", rest: "45s" },
      { name: "Mesa flexora", sets: "3 x 12", rest: "45s" },
      { name: "Elevação de quadril", sets: "4 x 12", rest: "60s" },
      { name: "Panturrilha em pé", sets: "4 x 20", rest: "30s" },
    ],
  },
  {
    name: "Treino A2",
    tag: "A",
    focus: "Peito • Ombro • Tríceps",
    duration: "60 min",
    level: "Intermediário",
    exercises: [
      { name: "Supino reto", sets: "4 x 10", rest: "75s" },
      { name: "Crucifixo halteres", sets: "3 x 12", rest: "60s" },
      { name: "Desenvolvimento halteres", sets: "4 x 10", rest: "75s" },
      { name: "Tríceps testa", sets: "4 x 12", rest: "60s" },
    ],
  },
  {
    name: "Treino B2",
    tag: "B",
    focus: "Costas • Bíceps",
    duration: "55 min",
    level: "Intermediário",
    exercises: [
      { name: "Barra fixa", sets: "4 x AMRAP", rest: "90s" },
      { name: "Remada cavalinho", sets: "4 x 10", rest: "75s" },
      { name: "Pulldown", sets: "3 x 12", rest: "60s" },
      { name: "Rosca scott", sets: "3 x 12", rest: "60s" },
    ],
  },
  {
    name: "Cardio & Core",
    tag: "🏃",
    focus: "HIIT • Abdômen",
    duration: "40 min",
    level: "Moderado",
    exercises: [
      { name: "Corrida intervalada", sets: "10 x 1min", rest: "1min" },
      { name: "Prancha", sets: "3 x 45s", rest: "30s" },
      { name: "Abdominal remador", sets: "4 x 15", rest: "30s" },
      { name: "Mountain climbers", sets: "4 x 40s", rest: "20s" },
    ],
  },
];

/** Plano de performance: mescla musculação e corrida. */
const PERFORMANCE: SimpleWorkout[] = [
  {
    name: "Regenerativo",
    tag: "off",
    focus: "Mobilidade • Trote leve",
    duration: "35 min",
    level: "Recuperação",
    rest: true,
    exercises: [
      { name: "Trote regenerativo", sets: "20 min", rest: "-" },
      { name: "Mobilidade de tornozelo e quadril", sets: "3 x 10", rest: "30s" },
      { name: "Alongamento geral", sets: "8 min", rest: "-" },
    ],
  },
  {
    name: "Força Superior + Tiros",
    tag: "S1",
    focus: "Peito • Costas • Sprints",
    duration: "70 min",
    level: "Avançado",
    exercises: [
      { name: "Supino reto", sets: "4 x 8", rest: "90s" },
      { name: "Remada curvada", sets: "4 x 8", rest: "90s" },
      { name: "Desenvolvimento halteres", sets: "3 x 10", rest: "60s" },
      { name: "Puxada frente", sets: "3 x 12", rest: "60s" },
      { name: "Sprints na esteira", sets: "8 x 30s", rest: "60s" },
    ],
  },
  {
    name: "Corrida de Ritmo",
    tag: "🏃",
    focus: "Pace forte • Limiar",
    duration: "45 min",
    level: "Desafiador",
    exercises: [
      { name: "Aquecimento progressivo", sets: "10 min", rest: "-" },
      { name: "Blocos em ritmo forte", sets: "4 x 6 min", rest: "2 min trote" },
      { name: "Desaquecimento", sets: "8 min", rest: "-" },
      { name: "Core: prancha + hollow", sets: "3 rodadas", rest: "40s" },
    ],
  },
  {
    name: "Força Inferior",
    tag: "S2",
    focus: "Pernas • Glúteo • Potência",
    duration: "70 min",
    level: "Avançado",
    exercises: [
      { name: "Agachamento livre", sets: "5 x 6", rest: "2 min" },
      { name: "Levantamento terra romeno", sets: "4 x 8", rest: "90s" },
      { name: "Afundo búlgaro", sets: "3 x 10 cada", rest: "60s" },
      { name: "Saltos no caixote", sets: "4 x 8", rest: "60s" },
      { name: "Panturrilha em pé", sets: "4 x 15", rest: "30s" },
    ],
  },
  {
    name: "Intervalado Curto",
    tag: "🏃",
    focus: "VO2 máx • Velocidade",
    duration: "40 min",
    level: "Desafiador",
    exercises: [
      { name: "Aquecimento + educativos", sets: "12 min", rest: "-" },
      { name: "Tiros de 400 m", sets: "8 x 400 m", rest: "90s" },
      { name: "Desaquecimento", sets: "8 min", rest: "-" },
    ],
  },
  {
    name: "Full Body + Core",
    tag: "S3",
    focus: "Força geral • Estabilidade",
    duration: "60 min",
    level: "Intermediário",
    exercises: [
      { name: "Terra convencional", sets: "4 x 6", rest: "2 min" },
      { name: "Barra fixa", sets: "4 x AMRAP", rest: "90s" },
      { name: "Desenvolvimento militar", sets: "3 x 8", rest: "75s" },
      { name: "Prancha com peso", sets: "3 x 45s", rest: "40s" },
      { name: "Roda abdominal", sets: "3 x 12", rest: "40s" },
    ],
  },
  {
    name: "Longão",
    tag: "🏃",
    focus: "Resistência aeróbica",
    duration: "70 min",
    level: "Desafiador",
    exercises: [
      { name: "Corrida longa em ritmo leve", sets: "60 min", rest: "-" },
      { name: "Alongamento e liberação miofascial", sets: "10 min", rest: "-" },
    ],
  },
];

export const WORKOUT_PLANS: Record<Objetivo, SimpleWorkout[]> = {
  emagrecimento: EMAGRECIMENTO,
  "ganho de massa muscular": MASSA,
  foco: PERFORMANCE,
};

export const PLAN_LABELS: Record<Objetivo, string> = {
  emagrecimento: "Plano Queima — corridas e funcionais",
  "ganho de massa muscular": "Plano Hipertrofia — musculação A/B/C",
  foco: "Plano Performance — força + corrida",
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
