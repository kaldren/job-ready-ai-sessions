
-- Remove the foreign key constraint first
ALTER TABLE public.interview_sessions DROP CONSTRAINT IF EXISTS interview_sessions_user_id_fkey;

-- Now change the column type from uuid to text (this should work now)
ALTER TABLE public.interview_sessions ALTER COLUMN user_id TYPE text;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can create their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can update their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to view interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to create interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to update interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow all operations for development" ON public.interview_sessions;

-- Create a simple permissive policy for development
CREATE POLICY "Allow all operations for development" 
  ON public.interview_sessions 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
