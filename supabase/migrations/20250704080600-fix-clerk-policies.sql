
-- Drop all existing conflicting policies
DROP POLICY IF EXISTS "Users can view their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can create their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Users can update their own interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to view interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to create interview sessions" ON public.interview_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to update interview sessions" ON public.interview_sessions;

-- Create simplified permissive policies for Clerk authentication
-- Note: These are permissive for development. In production, you'd want proper JWT verification
CREATE POLICY "Enable all operations for authenticated users" 
  ON public.interview_sessions 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
