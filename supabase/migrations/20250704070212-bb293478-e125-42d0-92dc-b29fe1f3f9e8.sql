
-- Create a table for interview sessions
CREATE TABLE public.interview_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  job_title TEXT NOT NULL,
  job_level TEXT NOT NULL,
  job_industry TEXT NOT NULL,
  questions JSONB NOT NULL,
  total_time INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for interview sessions
CREATE POLICY "Users can view their own interview sessions" 
  ON public.interview_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interview sessions" 
  ON public.interview_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview sessions" 
  ON public.interview_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);
