
-- Update the user_id column to accept text instead of uuid to accommodate Clerk user IDs
ALTER TABLE public.interview_sessions ALTER COLUMN user_id TYPE text;

-- Update the RLS policies to work with the new text user_id
DROP POLICY IF EXISTS "Users can view their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can create their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can update their own interview sessions" ON public.interview_sessions;

-- Recreate policies that work with Clerk user IDs (text type)
CREATE POLICY "Users can view their own interview sessions" 
  ON public.interview_sessions 
  FOR SELECT 
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can create their own interview sessions" 
  ON public.interview_sessions 
  FOR INSERT 
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own interview sessions" 
  ON public.interview_sessions 
  FOR UPDATE 
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
