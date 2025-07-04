
-- First drop all policies that reference the user_id column
DROP POLICY IF EXISTS "Users can view their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can create their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can update their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to view interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to create interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to update interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.interview_sessions;

-- Now change the column type from uuid to text
ALTER TABLE public.interview_sessions ALTER COLUMN user_id TYPE text;

-- Create a simple permissive policy for development
CREATE POLICY "Allow all operations for development" 
  ON public.interview_sessions 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
