
-- First, disable RLS temporarily to remove all policy dependencies
ALTER TABLE public.interview_sessions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (this should work now that RLS is disabled)
DROP POLICY IF EXISTS "Users can view their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can create their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can update their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to view interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to create interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to update interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow all operations for development" ON public.interview_sessions;

-- Remove the foreign key constraint
ALTER TABLE public.interview_sessions DROP CONSTRAINT IF EXISTS interview_sessions_user_id_fkey;

-- Now change the column type from uuid to text
ALTER TABLE public.interview_sessions ALTER COLUMN user_id TYPE text USING user_id::text;

-- Re-enable RLS
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- Create a simple permissive policy for development
CREATE POLICY "Allow all operations for development" 
  ON public.interview_sessions 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
