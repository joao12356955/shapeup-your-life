CREATE TABLE public.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  banner_url text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  workout_frequency integer NOT NULL DEFAULT 3,
  meals_per_day integer NOT NULL DEFAULT 4,
  diet_notes text NOT NULL DEFAULT '',
  workout_notes text NOT NULL DEFAULT '',
  xp_reward integer NOT NULL DEFAULT 300,
  published boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.challenges TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.challenges TO authenticated;
GRANT ALL ON public.challenges TO service_role;

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated read published challenges" ON public.challenges
  FOR SELECT TO authenticated
  USING (published OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins insert challenges" ON public.challenges
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update challenges" ON public.challenges
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete challenges" ON public.challenges
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER challenges_touch BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.challenge_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (challenge_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.challenge_participants TO authenticated;
GRANT ALL ON public.challenge_participants TO service_role;

ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own participation select" ON public.challenge_participants
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "own participation insert" ON public.challenge_participants
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own participation delete" ON public.challenge_participants
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER challenge_participants_touch BEFORE UPDATE ON public.challenge_participants
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();