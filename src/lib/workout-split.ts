export type SimpleWorkout = { name: string; focus: string; duration: string; rest?: boolean };

/** Same weekly split used no dashboard (índice = dia da semana, 0 = domingo). */
export const WORKOUT_SPLIT: SimpleWorkout[] = [
  { name: "Descanso ativo", focus: "Mobilidade • Alongamento", duration: "30 min", rest: true },
  { name: "Treino A", focus: "Peito • Ombro • Tríceps", duration: "60 min" },
  { name: "Treino B", focus: "Costas • Bíceps • Posterior", duration: "60 min" },
  { name: "Treino C", focus: "Pernas • Glúteo • Panturrilha", duration: "70 min" },
  { name: "Treino A", focus: "Peito • Ombro • Tríceps", duration: "60 min" },
  { name: "Treino B", focus: "Costas • Bíceps", duration: "55 min" },
  { name: "Cardio & Core", focus: "HIIT • Abdômen", duration: "40 min" },
];

export function workoutForDay(dayIdx: number): SimpleWorkout {
  return WORKOUT_SPLIT[dayIdx % 7]!;
}
